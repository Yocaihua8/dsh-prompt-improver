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
  /** Template as a complete instruction ({draft} already filled with the draft); replaces the mode directive. */
  templateInstruction?: string
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
export const PREDICTION_INTERVAL_MS = 8_000

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
  /** Extra wording rules injected into the enhance system prompt; absent when empty. */
  customInstructions?: string
  /** Custom templates; missing or empty in older clients/settings. */
  templates?: EnhanceTemplate[]
  /** Left-click default action; missing in older clients/settings; normalized to enhance. */
  defaultAction?: DefaultAction
}
export const CUSTOM_INSTRUCTION_LIMIT = 500
export const DRAFT_PLACEHOLDER = '{draft}'
export const TEMPLATE_NAME_LIMIT = 40
export const TEMPLATE_TEXT_LIMIT = 2_000
export const TEMPLATE_LIMIT = 20

export interface EnhanceTemplate {
  id: string
  name: string
  text: string
}

/** Left-click default action; enhance keeps the released behavior. */
export type DefaultAction =
  | { kind: 'enhance' }
  | { kind: 'template-apply'; templateId: string }
  | { kind: 'template-adapt'; templateId: string }

/** Local application: the draft fills the placeholder; templates keep their remaining wording. */
export function applyTemplate(template: EnhanceTemplate, draft: string): string {
  return template.text.replace(DRAFT_PLACEHOLDER, () => draft)
}

function normalizeTemplates(value: unknown): EnhanceTemplate[] | undefined {
  if (!Array.isArray(value)) return undefined
  const seen = new Set<string>()
  const templates: EnhanceTemplate[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const record = entry as Record<string, unknown>
    const id = typeof record.id === 'string' ? record.id.trim() : ''
    const name = typeof record.name === 'string' ? record.name.trim() : ''
    const text = typeof record.text === 'string' ? record.text.trim() : ''
    if (!id || seen.has(id) || !name || name.length > TEMPLATE_NAME_LIMIT ||
        !text || text.length > TEMPLATE_TEXT_LIMIT) continue
    if (text.split(DRAFT_PLACEHOLDER).length - 1 !== 1) continue
    seen.add(id)
    templates.push({ id, name, text })
    if (templates.length >= TEMPLATE_LIMIT) break
  }
  return templates.length ? templates : undefined
}

function normalizeDefaultAction(value: unknown, templates: EnhanceTemplate[]): DefaultAction | undefined {
  if (!value || typeof value !== 'object') return undefined
  const kind = (value as Record<string, unknown>).kind
  if (kind === 'enhance') return { kind: 'enhance' }
  if (kind === 'template-apply' || kind === 'template-adapt') {
    const templateId = (value as Record<string, unknown>).templateId
    if (typeof templateId === 'string' && templates.some(template => template.id === templateId)) {
      return { kind, templateId }
    }
  }
  return undefined
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
  const custom = typeof value.customInstructions === 'string' ? value.customInstructions.trim() : ''
  if (custom.length > CUSTOM_INSTRUCTION_LIMIT) throw new Error('提示词增强设置无效，请重新选择。')
  const templates = normalizeTemplates(value.templates)
  const defaultAction = normalizeDefaultAction(value.defaultAction, templates ?? [])
  return { mode: value.mode, adoption: value.adoption, context: value.context, modelStrategy: value.modelStrategy,
    dedicated: value.dedicated ? { provider: value.dedicated.provider, model: value.dedicated.model,
      ...(value.dedicated.reasoningEffort ? { reasoningEffort: value.dedicated.reasoningEffort } : {}) } : null,
    mystery: value.mystery === true, predictionEnabled: value.predictionEnabled === true,
    ...(custom ? { customInstructions: custom } : {}),
    ...(templates ? { templates } : {}),
    ...(defaultAction && defaultAction.kind !== 'enhance' ? { defaultAction } : {}) }
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
