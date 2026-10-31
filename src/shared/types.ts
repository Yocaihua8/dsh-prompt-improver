import type { UiMessage } from './messages.js'
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
  /** Composer model at click time; gates the mystery injection independently of `selection`. */
  currentSelection?: ModelSelection | null
}

export interface EnhanceResponse {
  text: string
  context?: ContextReport
  selection?: ModelSelection
}

export interface PredictionRequest {
  sessionId: string
  draft: string
  protectedTokens: string[]
  selection: ModelSelection
  settings: EnhanceSettings
}
export interface PredictionResponse extends EnhanceResponse {}
export const PREDICTION_CHAR_LIMIT = 200
export const PREDICTION_TIMEOUT_MS = 30_000
export const PREDICTION_DEBOUNCE_MS = 800
export const PREDICTION_INTERVAL_MS = 3_000

export interface EnhanceSettings {
  mode: EnhanceMode
  adoption: 'direct' | 'preview'
  context: 'draft' | 'recent' | 'extended'
  modelStrategy: 'follow' | 'dedicated'
  dedicated: ModelSelection | null
  /** Prepend the capability declaration when the composer model is DeepSeek. */
  mystery: boolean
  /** Missing in older clients/settings; normalized to false. */
  predictionEnabled?: boolean
}
export interface ContextSource {
  kind: 'conversation' | 'memory' | 'project'
  label: string
  text: string
  labelMessage?: UiMessage
}
export interface ContextReport { sources: ContextSource[]; warnings: string[]; warningMessages?: Array<UiMessage | null> }
export interface ModelOption extends ModelSelection { label: string; efforts: string[] }
export interface Capabilities { owner: boolean; memory: boolean; personalMemory?: boolean; models: ModelOption[] }
export const DEFAULT_SETTINGS: EnhanceSettings = {
  mode: 'moderate', adoption: 'direct', context: 'recent', modelStrategy: 'follow', dedicated: null, mystery: false, predictionEnabled: false,
}

export function validateSettings(value: EnhanceSettings): EnhanceSettings {
  if (!value || !isEnhanceMode(value.mode) || !['direct', 'preview'].includes(value.adoption) ||
      !['draft', 'recent', 'extended'].includes(value.context) || !['follow', 'dedicated'].includes(value.modelStrategy) ||
      value.dedicated !== null && (!value.dedicated || !validSelection(value.dedicated)) ||
      value.modelStrategy === 'dedicated' && !value.dedicated) throw new Error('提示词增强设置无效，请重新选择。')
  return { mode: value.mode, adoption: value.adoption, context: value.context, modelStrategy: value.modelStrategy,
    dedicated: value.dedicated ? { provider: value.dedicated.provider, model: value.dedicated.model,
      ...(value.dedicated.reasoningEffort ? { reasoningEffort: value.dedicated.reasoningEffort } : {}) } : null,
    mystery: value.mystery === true, predictionEnabled: value.predictionEnabled === true }
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

/** Only the composer model id decides the mystery injection; aliases fall back to "not DeepSeek". */
export function isDeepSeekModel(modelId: string | null | undefined): boolean {
  return typeof modelId === 'string' && /deepseek/i.test(modelId)
}

export function sameSelection(a: ModelSelection | null, b: ModelSelection | null): boolean {
  return a?.provider === b?.provider && a?.model === b?.model && a?.reasoningEffort === b?.reasoningEffort
}
