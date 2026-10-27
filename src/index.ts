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

export type { EnhanceRequest, EnhanceResponse, EnhanceMode, ModelSelection } from './shared/types.js'

declare module '@deepseek-ai/cordis' {
  interface Context { promptEnhance: PromptEnhance }
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface RemoteErrorDetailsMap {
    'prompt-enhance/failed': { reason: string }
  }
}

/** Host service registered by the plugin bundle. */
export default class PromptEnhance extends TypertRemoteService {
  static inject = ['llm', 'sessionQuery', 'typert', 'workspaceRegistry', 'subprocess']
  private readonly lifetime = new AbortController()
  private readonly settings = new SettingsStore(dshHomePath('plugins', 'dsh-link-prompt-enhance', 'settings.json'))

  private requireOwner(signal: AbortSignal): void {
    signal.throwIfAborted()
    if (this.ctx.invocation?.peer.principal.kind !== 'owner') {
      throw new RemoteError('prompt-enhance/failed', '设置管理和扩展上下文仅允许宿主所有者使用。', { reason: 'forbidden' })
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
      return await enhanceDraft(this.ctx, request, AbortSignal.any([signal, this.lifetime.signal]), undefined, {
        extended: (request, signal) => extendedContext(this.ctx, this.ctx.get('memory') as MemoryRecallService | undefined, request, signal),
      })
    } catch (error) {
      if (error instanceof RemoteError) throw error
      if (error instanceof EnhanceError) throw new RemoteError('prompt-enhance/failed', error.message, { reason: error.code })
      throw new RemoteError('prompt-enhance/failed', '增强失败，已保留原文。', { reason: 'failed' })
    }
  }

  @Remote
  async getSettings(legacyMode: string | undefined, signal: AbortSignal): Promise<EnhanceSettings> {
    this.requireOwner(signal)
    try { return await this.settings.read(legacyMode) }
    catch { throw new RemoteError('prompt-enhance/failed', '设置读取失败，未覆盖原设置。', { reason: 'settings-read' }) }
  }

  @Remote
  async saveSettings(settings: EnhanceSettings, signal: AbortSignal): Promise<EnhanceSettings> {
    this.requireOwner(signal)
    try { return await this.settings.save(settings) }
    catch { throw new RemoteError('prompt-enhance/failed', '设置保存失败，请检查选项后重试。', { reason: 'settings-write' }) }
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
    const memory = this.ctx.get('memory') as MemoryRecallService | undefined
    return { owner, memory: typeof memory?.recallForProject === 'function', models }
  }
}
