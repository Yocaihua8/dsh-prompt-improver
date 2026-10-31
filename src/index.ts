import { describeMessage, type UiMessage } from './shared/messages.js'
import type { Context } from '@deepseek-ai/cordis'
import { SessionId } from '@deepseek-ai/dsh-session/types'
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-session-query'
import { dshHomePath } from '@deepseek-ai/dsh-home-paths'
import { SettingsStore } from './host/settings.js'
import { extendedContext } from './host/context.js'
import type { MemoryRecallService } from './shared/generated/memory-contract.js'
import { enhanceDraft, EnhanceError } from './host/enhance.js'
import type { Capabilities, EnhanceRequest, EnhanceResponse, EnhanceSettings, ModelOption } from './shared/types.js'
import { PREDICTION_INTERVAL_MS, validateSettings, type PredictionRequest, type PredictionResponse } from './shared/types.js'
import { predictDraft, validatePrediction } from './host/prediction.js'
import type { ContextMemoryService } from './shared/generated/context-memory-contract.js'

export type { EnhanceRequest, EnhanceResponse, EnhanceMode, ModelSelection } from './shared/types.js'
export type { PredictionRequest, PredictionResponse } from './shared/types.js'

declare module '@deepseek-ai/cordis' {
  interface Context { promptEnhance: PromptEnhance }
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'prompt-enhance/failed': { reason: string } & Partial<UiMessage>
  }
}

/** Host service registered by the plugin bundle. */
export default class PromptEnhance extends TypertRemoteService {
  static inject = ['llm', 'sessionQuery', 'typert', 'workspaceRegistry', 'subprocess']
  private readonly lifetime = new AbortController()
  private readonly predictions = new Map<string, AbortController>()
  private readonly predictionStarts = new Map<string, number>()
  private settingsRevision = 0
  // Keep the existing data path across the package rename, including rollback.
  private readonly settings = new SettingsStore(dshHomePath('plugins', 'dsh-link-prompt-enhance', 'settings.json'))

  private requireOwner(signal: AbortSignal): void {
    signal.throwIfAborted()
    if (this.ctx.invocation?.peer.principal.kind !== 'owner') {
      throw new RemoteError('prompt-enhance/failed', '设置管理和扩展上下文仅允许宿主所有者使用。', { reason: 'forbidden', ...describeMessage('设置管理和扩展上下文仅允许宿主所有者使用。') })
    }
  }

  constructor(ctx: Context) {
    super(ctx, 'promptEnhance')
    ctx.effect(() => () => { this.lifetime.abort() })
  }

  /** Enhance a draft using the selected model and completed recent conversation. */
  @Remote({ resources: { session: (request) => SessionId(request.sessionId) } })
  async enhance(request: EnhanceRequest, signal: AbortSignal): Promise<EnhanceResponse> {
    try {
      if (request.settings?.context === 'extended') this.requireOwner(signal)
      return withMessages(await enhanceDraft(this.ctx, request, AbortSignal.any([signal, this.lifetime.signal]), undefined, {
        extended: (request, signal) => extendedContext(this.ctx, this.ctx.get('memory') as MemoryRecallService | undefined, request, signal),
      }))
    } catch (error) {
      if (error instanceof RemoteError) throw error
      if (error instanceof EnhanceError) throw new RemoteError('prompt-enhance/failed', error.message, { reason: error.code, ...describeMessage(error.message) })
      throw new RemoteError('prompt-enhance/failed', '增强失败，已保留原文。', { reason: 'failed', ...describeMessage('增强失败，已保留原文。') })
    }
  }

  @Remote({ resources: { session: (request) => SessionId(request.sessionId) } })
  async predict(request: PredictionRequest, signal: AbortSignal): Promise<PredictionResponse> {
    this.requireOwner(signal)
    let active: AbortController | undefined
    try {
      validatePrediction(request)
      const revision = this.settingsRevision
      const saved = await this.settings.read()
      if (!saved.predictionEnabled) throw new EnhanceError('prediction-disabled', '输入预测已关闭。')
      if (revision !== this.settingsRevision || JSON.stringify(saved) !== JSON.stringify(validateSettings(request.settings))) throw new EnhanceError('settings-changed', '预测设置已变化，请刷新设置。')
      signal.throwIfAborted()
      const now = Date.now()
      if (this.predictions.has(request.sessionId) || now - (this.predictionStarts.get(request.sessionId) ?? 0) < PREDICTION_INTERVAL_MS) throw new EnhanceError('prediction-busy', '预测请求过于频繁，本次已跳过。')
      for (const [id, time] of this.predictionStarts) if (now - time > 120000) this.predictionStarts.delete(id)
      active = new AbortController()
      this.predictions.set(request.sessionId, active); this.predictionStarts.set(request.sessionId, now)
      return withMessages(await predictDraft(this.ctx, request, AbortSignal.any([signal, active.signal, this.lifetime.signal]), this.ctx.get('memory') as ContextMemoryService | undefined))
    } catch (error) {
      if (error instanceof RemoteError) throw error
      if (error instanceof EnhanceError) throw new RemoteError('prompt-enhance/failed', error.message, { reason: error.code })
      throw new RemoteError('prompt-enhance/failed', '输入预测失败，本次未显示建议。', { reason: 'prediction-failed', ...describeMessage('输入预测失败，本次未显示建议。') })
    } finally {
      if (active && this.predictions.get(request.sessionId) === active) this.predictions.delete(request.sessionId)
    }
  }

  @Remote
  async getSettings(legacyMode: string | undefined, signal: AbortSignal): Promise<EnhanceSettings> {
    this.requireOwner(signal)
    try { return await this.settings.read(legacyMode) }
    catch { throw new RemoteError('prompt-enhance/failed', '设置读取失败，未覆盖原设置。', { reason: 'settings-read', ...describeMessage('设置读取失败，未覆盖原设置。') }) }
  }

  @Remote
  async saveSettings(settings: EnhanceSettings, signal: AbortSignal): Promise<EnhanceSettings> {
    this.requireOwner(signal)
    try {
      const saved = await this.settings.save(settings)
      this.settingsRevision++
      for (const request of this.predictions.values()) request.abort()
      return saved
    }
    catch { throw new RemoteError('prompt-enhance/failed', '设置保存失败，请检查选项后重试。', { reason: 'settings-write', ...describeMessage('设置保存失败，请检查选项后重试。') }) }
  }

  @Remote
  async capabilities(signal: AbortSignal): Promise<Capabilities> {
    signal.throwIfAborted()
    const owner = this.ctx.invocation?.peer.principal.kind === 'owner'
    if (!owner) return { owner: false, memory: false, models: [] }
    const models: ModelOption[] = []
    for (const provider of this.ctx.llm.listProviders()) {
      signal.throwIfAborted()
      try {
        for (const model of await this.ctx.llm.listModels(provider.id)) {
          signal.throwIfAborted()
          const info = await this.ctx.llm.resolveModelInfo(provider.id, model.id, signal)
          models.push({ provider: provider.id, model: model.id, label: `${provider.name} · ${model.name}`,
            efforts: info.reasoning?.efforts.map(effort => effort.id) ?? [] })
        }
      } catch { signal.throwIfAborted() /* Unavailable routes cannot be selected. */ }
    }
    const memory = this.ctx.get('memory') as ContextMemoryService | undefined
    return { owner, memory: typeof memory?.recallForProject === 'function', personalMemory: memory?.recallContextVersion === 2 && typeof memory.recallForPersonal === 'function', models }
  }
}

function withMessages<T extends EnhanceResponse>(response: T): T {
 if (!response.context) return response
 return { ...response, context: { ...response.context, warningMessages: response.context.warnings.map(value => describeMessage(value) ?? null) } }
}
