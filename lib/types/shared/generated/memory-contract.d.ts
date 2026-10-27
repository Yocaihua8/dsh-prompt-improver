/** Shared by trusted Host plugins. This module has no Host or storage dependency. */
export declare const MEMORY_CONTRACT_VERSION = 1;
export declare const MAX_RECALL_QUERY_CHARS = 16000;
export declare const MAX_RECALL_ENTRIES = 12;
/** JSON.stringify(entries).length, including escaping and array punctuation. */
export declare const MAX_RECALL_CHARS = 4000;
export interface ProjectRecallRequest {
    projectPath: string;
    query: string;
}
export interface RecalledMemory {
    id: string;
    revision: number;
    scope: 'personal' | 'project';
    kind: 'preference' | 'fact' | 'decision';
    topic: string;
    content: string;
    manual: boolean;
}
export interface ProjectRecallResult {
    /** Missing only on the original v1 provider; unknown versions are rejected. */
    contractVersion?: typeof MEMORY_CONTRACT_VERSION;
    status: 'available' | 'disabled';
    entries: RecalledMemory[];
}
/** Same-process capability; it is not a public or owner RPC. */
export interface MemoryRecallService {
    recallForProject(request: ProjectRecallRequest, signal: AbortSignal): Promise<unknown>;
}
export declare class MemoryRecallContractError extends Error {
    readonly code = "invalid-response";
    constructor();
}
/** Retain whole records in ranking order without exceeding either result budget. */
export declare function boundRecallEntries(candidates: readonly RecalledMemory[]): RecalledMemory[];
/** Validate all records before applying limits; discard fields outside this contract. */
export declare function validateProjectRecallResult(value: unknown): ProjectRecallResult;
