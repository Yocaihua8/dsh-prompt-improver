export type EnhanceMode = 'moderate' | 'expanded'

export interface ModelSelection {
  provider: string
  model: string
  reasoningEffort?: string
}

export interface EnhanceRequest {
  sessionId: string
  draft: string
  mode: EnhanceMode
  selection: ModelSelection
  /** Tokens identifying references; identities stay in the browser. */
  protectedTokens: string[]
  /** Immutable settings captured by the client at click time. */
  settings?: EnhanceSettings
}

export interface EnhanceResponse {
  text: string
  context?: ContextReport
  selection?: ModelSelection
}

export interface EnhanceSettings {
  mode: EnhanceMode
  adoption: 'direct' | 'preview'
  context: 'draft' | 'recent' | 'extended'
  modelStrategy: 'follow' | 'dedicated'
  dedicated: ModelSelection | null
}
export interface ContextSource {
  kind: 'conversation' | 'memory' | 'project'
  label: string
  text: string
}
export interface ContextReport { sources: ContextSource[]; warnings: string[] }
export interface ModelOption extends ModelSelection { label: string; efforts: string[] }
export interface Capabilities { owner: boolean; memory: boolean; models: ModelOption[] }
export const DEFAULT_SETTINGS: EnhanceSettings = {
  mode: 'moderate', adoption: 'direct', context: 'recent', modelStrategy: 'follow', dedicated: null,
}

export function validateSettings(value: EnhanceSettings): EnhanceSettings {
  if (!value || !isEnhanceMode(value.mode) || !['direct', 'preview'].includes(value.adoption) ||
      !['draft', 'recent', 'extended'].includes(value.context) || !['follow', 'dedicated'].includes(value.modelStrategy) ||
      value.dedicated !== null && (!value.dedicated || !validSelection(value.dedicated)) ||
      value.modelStrategy === 'dedicated' && !value.dedicated) throw new Error('提示词增强设置无效，请重新选择。')
  return { mode: value.mode, adoption: value.adoption, context: value.context, modelStrategy: value.modelStrategy,
    dedicated: value.dedicated ? { provider: value.dedicated.provider, model: value.dedicated.model,
      ...(value.dedicated.reasoningEffort ? { reasoningEffort: value.dedicated.reasoningEffort } : {}) } : null }
}
export function validSelection(value: ModelSelection): boolean {
  return typeof value.provider === 'string' && !!value.provider.trim() && value.provider.length <= 200 &&
    typeof value.model === 'string' && !!value.model.trim() && value.model.length <= 200 &&
    (value.reasoningEffort === undefined || typeof value.reasoningEffort === 'string' && /^[\w-]{1,80}$/.test(value.reasoningEffort))
}

export const TIMEOUT_MS = 120_000
export const HISTORY_CHAR_LIMIT = 12_000
export const HISTORY_TURN_LIMIT = 3
export const DRAFT_CHAR_LIMIT = 32_000

export function isEnhanceMode(value: unknown): value is EnhanceMode {
  return value === 'moderate' || value === 'expanded'
}

export function sameSelection(a: ModelSelection | null, b: ModelSelection | null): boolean {
  return a?.provider === b?.provider && a?.model === b?.model && a?.reasoningEffort === b?.reasoningEffort
}
