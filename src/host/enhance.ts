import { BlockAssembler, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session/types'
import type { Context } from '@deepseek-ai/cordis'
import { DRAFT_CHAR_LIMIT, isEnhanceMode, TIMEOUT_MS, validateSettings } from '../shared/types.js'
import type { EnhanceRequest, EnhanceResponse } from '../shared/types.js'
import { validateTokens } from '../shared/references.js'
import { collectContext } from './context.js'
import type { ContextServices } from './context.js'
import { systemPrompt, userPrompt } from './prompt.js'
import type {} from '@deepseek-ai/dsh-session-query'

export class EnhanceError extends Error {
  constructor(readonly code: string, message: string) { super(message) }
}

/** Bound local reads and adapters even if they fail to observe cancellation. */
async function abortable<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  let stop!: () => void
  const aborted = new Promise<never>((_, reject) => {
    stop = () => reject(signal.reason)
    if (signal.aborted) stop()
    else signal.addEventListener('abort', stop, { once: true })
  })
  try { return await Promise.race([work, aborted]) }
  finally { signal.removeEventListener('abort', stop) }
}

export function validateRequest(request: EnhanceRequest): void {
  if (!request || typeof request.sessionId !== 'string' || !request.sessionId.trim() ||
      typeof request.draft !== 'string' || !request.draft.trim() || request.draft.length > DRAFT_CHAR_LIMIT ||
      !isEnhanceMode(request.mode) || !request.selection ||
      typeof request.selection.provider !== 'string' || !request.selection.provider.trim() ||
      typeof request.selection.model !== 'string' || !request.selection.model.trim() ||
      request.selection.reasoningEffort !== undefined &&
        (typeof request.selection.reasoningEffort !== 'string' || !request.selection.reasoningEffort.trim()) ||
      !Array.isArray(request.protectedTokens) || request.protectedTokens.length > 128 ||
      request.protectedTokens.some(token => typeof token !== 'string' || !/^⟦DSH_REF_[A-Za-z0-9-]+_\d+⟧$/u.test(token))) {
    throw new EnhanceError('invalid-request', `请输入有效草稿（最多 ${DRAFT_CHAR_LIMIT.toLocaleString()} 字符）并选择可用模型。`)
  }
  try { validateTokens(request.draft, request.protectedTokens) }
  catch { throw new EnhanceError('invalid-references', '草稿引用校验失败，请重试。') }
  if (request.settings) {
    try { validateSettings(request.settings) }
    catch { throw new EnhanceError('invalid-settings', '提示词增强设置无效。') }
  }
}

/** One auxiliary call; never enters the agent loop or appends conversation messages. */
export async function enhanceDraft(
  ctx: Pick<Context, 'llm' | 'sessionQuery'>,
  request: EnhanceRequest,
  callerSignal: AbortSignal,
  timeoutMs = TIMEOUT_MS,
  services: ContextServices = {},
): Promise<EnhanceResponse> {
  validateRequest(request)
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(new EnhanceError('timeout', '增强超时，已保留原文。')), timeoutMs)
  const signal = AbortSignal.any([callerSignal, timeout.signal])
  try {
    return await abortable((async () => {
    signal.throwIfAborted()
    const context = await collectContext(ctx, request, signal, services)
    const selection = request.settings?.modelStrategy === 'dedicated' ? request.settings.dedicated! : request.selection
    if (request.settings?.modelStrategy === 'dedicated') {
      let available = false
      try { available = (await ctx.llm.listModels(selection.provider)).some(model => model.id === selection.model) } catch { /* No fallback. */ }
      if (!available) throw new EnhanceError('dedicated-unavailable', '专用增强模型已不可用，请在提示词增强设置中重新选择；未切换模型。')
    }
    const call = await ctx.llm.prepareCall({
      ...selection,
      reasoningEffort: selection.reasoningEffort === undefined ? undefined : ReasoningEffortId(selection.reasoningEffort),
    }, signal)
    const assembler = new BlockAssembler()
    let receivedFinish = false
    for await (const chunk of call.stream({
      ...call.config,
      sessionId: SessionId(request.sessionId),
      system: systemPrompt(request.mode),
      messages: [{ role: 'user', content: [{ type: 'text', text: userPrompt(request, context) }] }],
      signal,
    })) {
      signal.throwIfAborted()
      if (chunk.type === 'finish') receivedFinish = true
      assembler.push(chunk)
    }
    signal.throwIfAborted()
    if (!receivedFinish) throw new EnhanceError('unexpected-result', '模型响应未完整结束，已保留原文。')
    const finish = assembler.finish
    if (finish.kind === 'error' || finish.kind === 'aborted') throw new EnhanceError(finish.failure.code, '模型调用失败，已保留原文。')
    if (finish.kind === 'max-tokens') throw new EnhanceError('truncated', '增强结果被截断，已保留原文。')
    if (finish.kind !== 'stop') throw new EnhanceError('unexpected-result', '模型未返回完整提示词，已保留原文。')
    const blocks = assembler.blocks()
    if (blocks.some(block => block.type === 'tool-call')) throw new EnhanceError('unexpected-result', '模型返回了工具调用，已保留原文。')
    const text = blocks.flatMap(block => block.type === 'text' ? [block.text] : []).join('').trim()
    if (!text) throw new EnhanceError('empty-result', '模型返回了空结果，已保留原文。')
    if (text.length > DRAFT_CHAR_LIMIT) throw new EnhanceError('result-too-long', '增强结果过长，已保留原文。')
    try { validateTokens(text, request.protectedTokens) }
    catch { throw new EnhanceError('invalid-references', '增强结果未完整保留引用，已保留原文。') }
    // Catch obvious Chinese/Latin translation drift without another model call.
    const hadHan = /\p{Script=Han}/u.test(request.draft)
    if (hadHan && !/\p{Script=Han}/u.test(text) || !hadHan && /[A-Za-z]/u.test(request.draft) && /\p{Script=Han}/u.test(text)) {
      throw new EnhanceError('language-changed', '增强结果改变了草稿语言，已保留原文。请重试或检查模型。')
    }
    return { text, context, selection }
    })(), signal)
  } catch (error) {
    if (callerSignal.aborted) throw new EnhanceError('cancelled', '已取消增强。')
    if (timeout.signal.aborted) throw new EnhanceError('timeout', '增强超时，已保留原文。')
    if (error instanceof EnhanceError) throw error
    const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' ? error.code : 'failed'
    // Provider messages can contain endpoints or credentials; only a bounded,
    // neutral code crosses the RPC boundary, never the original error body.
    throw new EnhanceError(/^[A-Za-z0-9_/-]{1,80}$/.test(code) ? code : 'failed', '增强失败，请检查模型可用性和会话状态；原文已保留。')
  } finally {
    clearTimeout(timer)
  }
}
