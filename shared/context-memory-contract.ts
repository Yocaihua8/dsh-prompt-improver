import { MAX_RECALL_CHARS, MAX_RECALL_ENTRIES, validateProjectRecallResult, type ProjectRecallRequest, type RecalledMemory, type MemoryRecallService } from './memory-contract.js'

export type RecallPurpose = 'chat' | 'enhance' | 'automation-proposal' | 'automation-run'
export const CONTEXT_RECALL_VERSION = 2
export interface ContextRecallRequest extends ProjectRecallRequest { purpose: RecallPurpose }
export interface ContextMemory extends RecalledMemory {
  category: 'expression' | 'workflow' | 'background' | 'interests' | 'facts' | 'decisions' | 'stage'
  conditions: string[]
  confirmedAt: string
  validUntil?: string
}
export interface ContextRecallResult {
  contractVersion: 2; status: 'available' | 'disabled'; entries: ContextMemory[];
}
export interface ContextMemoryService extends MemoryRecallService {
  readonly recallContextVersion?: number
  recallForContext?(request: ContextRecallRequest, signal: AbortSignal): Promise<unknown>
  /** Personal scope only; absence means the provider predates projectless recall. */
  recallForPersonal?(request: { query: string }, signal: AbortSignal): Promise<unknown>
}
export function validateContextRecall(value: unknown, now = Date.now()): ContextRecallResult {
  if (!value || typeof value !== 'object') throw new Error('记忆上下文响应无效。')
  const result = value as ContextRecallResult
  if (result.contractVersion !== 2) throw new Error('记忆上下文版本不兼容。')
  validateProjectRecallResult({ ...result, contractVersion: 1 })
  const entries: ContextMemory[] = []
  for (const entry of result.entries) {
    if (!['expression', 'workflow', 'background', 'interests', 'facts', 'decisions', 'stage'].includes(entry.category)
      || !Array.isArray(entry.conditions) || entry.conditions.length > 8 || entry.conditions.some(term => typeof term !== 'string' || !term.trim() || term.length > 80)
      || typeof entry.confirmedAt !== 'string' || !Number.isFinite(Date.parse(entry.confirmedAt))
      || (entry.validUntil !== undefined && (typeof entry.validUntil !== 'string' || !Number.isFinite(Date.parse(entry.validUntil))))
      || (entry.category === 'stage' && !entry.validUntil)
      || (['facts', 'decisions', 'stage'].includes(entry.category) ? entry.scope !== 'project' : entry.scope !== 'personal')) throw new Error('记忆上下文条目无效。')
    const base = validateProjectRecallResult({ contractVersion: 1, status: 'available', entries: [entry] }).entries[0]
    if (!base || (entry.validUntil && now >= Date.parse(entry.validUntil))) continue
    const clean: ContextMemory = { ...base, category: entry.category, conditions: [...entry.conditions], confirmedAt: entry.confirmedAt,
      ...(entry.validUntil ? { validUntil: entry.validUntil } : {}) }
    if (entries.length < MAX_RECALL_ENTRIES && JSON.stringify([...entries, clean]).length <= MAX_RECALL_CHARS) entries.push(clean)
  }
  return { contractVersion: 2, status: result.status, entries }
}
