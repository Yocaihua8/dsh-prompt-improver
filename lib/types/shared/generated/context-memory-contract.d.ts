import { type ProjectRecallRequest, type RecalledMemory, type MemoryRecallService } from './memory-contract.js';
export type RecallPurpose = 'chat' | 'enhance' | 'automation-proposal' | 'automation-run';
export declare const CONTEXT_RECALL_VERSION = 2;
export interface ContextRecallRequest extends ProjectRecallRequest {
    purpose: RecallPurpose;
}
export interface ContextMemory extends RecalledMemory {
    category: 'expression' | 'workflow' | 'background' | 'interests' | 'facts' | 'decisions' | 'stage';
    conditions: string[];
    confirmedAt: string;
    validUntil?: string;
}
export interface ContextRecallResult {
    contractVersion: 2;
    status: 'available' | 'disabled';
    entries: ContextMemory[];
}
export interface ContextMemoryService extends MemoryRecallService {
    readonly recallContextVersion?: number;
    recallForContext?(request: ContextRecallRequest, signal: AbortSignal): Promise<unknown>;
    /** Personal scope only; absence means the provider predates projectless recall. */
    recallForPersonal?(request: {
        query: string;
    }, signal: AbortSignal): Promise<unknown>;
}
export declare function validateContextRecall(value: unknown, now?: number): ContextRecallResult;
