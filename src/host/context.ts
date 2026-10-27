import { realpath } from 'node:fs/promises'
import type { Context } from '@deepseek-ai/cordis'
import { SessionId } from '@deepseek-ai/dsh-session/types'
import type {} from '@deepseek-ai/dsh-workspace'
import type { ContextReport, EnhanceRequest } from '../shared/types.js'
import type { MemoryRecallService } from '../shared/generated/memory-contract.js'
import { validateProjectRecallResult } from '../shared/generated/memory-contract.js'
import { recentConversation } from './history.js'
import { searchProject } from './project.js'
import { EnhanceError } from './enhance.js'

export interface ContextServices { extended?(request: EnhanceRequest, signal: AbortSignal): Promise<ContextReport> }
export async function collectContext(ctx: Pick<Context, 'sessionQuery'>, request: EnhanceRequest, signal: AbortSignal, services: ContextServices): Promise<ContextReport> {
  const mode = request.settings?.context ?? 'recent'
  const report: ContextReport = { sources: [], warnings: [] }
  if (mode === 'draft') return report
  try {
    const surface = await ctx.sessionQuery.readSurface(SessionId(request.sessionId))
    signal.throwIfAborted()
    const raw = await ctx.sessionQuery.readSession(SessionId(request.sessionId))
    signal.throwIfAborted()
    const budget = mode === 'extended' ? 8000 : 12000
    const history = recentConversation(surface.events, raw.events, surface.capturedThroughSeq, budget)
    const full = recentConversation(surface.events, raw.events, surface.capturedThroughSeq, Number.MAX_SAFE_INTEGER)
    if (JSON.stringify(full) !== JSON.stringify(history)) report.warnings.push('最近对话已按完整轮次及字符预算裁剪。')
    report.sources.push(...history.map((message, index) => ({ kind: 'conversation' as const, label: `${Math.floor(index / 2) + 1} · ${message.role === 'user' ? '用户' : '助手'}`, text: message.text })))
  } catch {
    signal.throwIfAborted()
    throw new EnhanceError('history-unavailable', '读取会话历史失败，已保留原文。')
  }
  if (mode === 'extended') {
    if (!services.extended) throw new EnhanceError('context-unavailable', '扩展上下文服务不可用。')
    const extended = await services.extended(request, signal)
    report.sources.push(...extended.sources); report.warnings.push(...extended.warnings)
  }
  return report
}

export async function extendedContext(ctx: Pick<Context, 'workspaceRegistry' | 'subprocess'>, memory: MemoryRecallService | undefined, request: EnhanceRequest, signal: AbortSignal): Promise<ContextReport> {
  const report: ContextReport = { sources: [], warnings: [] }
  const workspace = ctx.workspaceRegistry.list().find(workspace => workspace.sessionIds.includes(SessionId(request.sessionId)))
  if (!workspace || await workspace.status() !== 'ok') {
    report.warnings.push('当前会话没有可用项目，未读取项目记忆或项目文件。')
    return report
  }
  let root: string
  try { root = await realpath(workspace.path) }
  catch { report.warnings.push('当前项目目录读取失败，未读取记忆或项目文件。'); return report }
  signal.throwIfAborted()
  if (!memory) report.warnings.push('记忆服务不可用，未采用记忆。')
  else {
    const timeout = AbortSignal.timeout(3000)
    const memorySignal = AbortSignal.any([signal, timeout])
    let stop!: () => void
    try {
      const cancelled = new Promise<never>((_, reject) => {
        stop = () => reject(memorySignal.reason)
        if (memorySignal.aborted) stop(); else memorySignal.addEventListener('abort', stop, { once: true })
      })
      const result = validateProjectRecallResult(await Promise.race([
        memory.recallForProject({ projectPath: root, query: request.draft.slice(0, 16000) }, memorySignal), cancelled,
      ]))
      if (result.status === 'disabled') report.warnings.push('记忆已关闭，未采用记忆。')
      else report.sources.push(...result.entries.map(entry => ({ kind: 'memory' as const, label: `${entry.scope === 'personal' ? '个人' : '项目'} · ${entry.topic}`, text: entry.content })))
    } catch {
      signal.throwIfAborted()
      report.warnings.push(timeout.aborted ? '记忆召回超时，未采用记忆。' : '记忆召回失败或接口不兼容，未采用记忆。')
    } finally { memorySignal.removeEventListener('abort', stop) }
  }
  const project = await searchProject(ctx, root, request.draft, signal)
  report.sources.push(...project.sources); report.warnings.push(...project.warnings)
  return report
}
