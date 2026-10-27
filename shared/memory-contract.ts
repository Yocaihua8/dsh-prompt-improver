/** Shared by trusted Host plugins. This module has no Host or storage dependency. */
export const MEMORY_CONTRACT_VERSION = 1
export const MAX_RECALL_QUERY_CHARS = 16000
export const MAX_RECALL_ENTRIES = 12
/** JSON.stringify(entries).length, including escaping and array punctuation. */
export const MAX_RECALL_CHARS = 4000

export interface ProjectRecallRequest { projectPath: string; query: string }
export interface RecalledMemory {
  id: string
  revision: number
  scope: 'personal' | 'project'
  kind: 'preference' | 'fact' | 'decision'
  topic: string
  content: string
  manual: boolean
}
export interface ProjectRecallResult {
  /** Missing only on the original v1 provider; unknown versions are rejected. */
  contractVersion?: typeof MEMORY_CONTRACT_VERSION
  status: 'available' | 'disabled'
  entries: RecalledMemory[]
}
/** Same-process capability; it is not a public or owner RPC. */
export interface MemoryRecallService {
  recallForProject(request: ProjectRecallRequest, signal: AbortSignal): Promise<unknown>
}

export class MemoryRecallContractError extends Error {
  readonly code = 'invalid-response'
  constructor() {
    super('记忆服务返回了无效的项目召回结果。')
    this.name = 'MemoryRecallContractError'
  }
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

function validateEntry(value: unknown): RecalledMemory {
  if (!record(value) || !text(value.id) || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0
    || (value.scope !== 'personal' && value.scope !== 'project')
    || (value.kind !== 'preference' && value.kind !== 'fact' && value.kind !== 'decision')
    || !text(value.topic) || !text(value.content) || typeof value.manual !== 'boolean') throw new MemoryRecallContractError()
  return { id: value.id, revision: Number(value.revision), scope: value.scope,
    kind: value.kind, topic: value.topic, content: value.content, manual: value.manual }
}

/** Retain whole records in ranking order without exceeding either result budget. */
export function boundRecallEntries(candidates: readonly RecalledMemory[]): RecalledMemory[] {
  const entries: RecalledMemory[] = []
  for (const entry of candidates) {
    if (entries.length >= MAX_RECALL_ENTRIES) break
    if (JSON.stringify([...entries, entry]).length > MAX_RECALL_CHARS) continue
    entries.push(entry)
  }
  return entries
}

/** Validate all records before applying limits; discard fields outside this contract. */
export function validateProjectRecallResult(value: unknown): ProjectRecallResult {
  if (!record(value) || (value.contractVersion !== undefined && value.contractVersion !== MEMORY_CONTRACT_VERSION)
    || (value.status !== 'available' && value.status !== 'disabled') || !Array.isArray(value.entries)) throw new MemoryRecallContractError()
  const version: Pick<ProjectRecallResult, 'contractVersion'> = value.contractVersion === undefined ? {} : { contractVersion: MEMORY_CONTRACT_VERSION }
  if (value.status === 'disabled') {
    if (value.entries.length) throw new MemoryRecallContractError()
    return { ...version, status: 'disabled', entries: [] }
  }
  const candidates = value.entries.map(validateEntry)
  if (new Set(candidates.map(entry => entry.id)).size !== candidates.length) throw new MemoryRecallContractError()
  return { ...version, status: 'available', entries: boundRecallEntries(candidates) }
}
