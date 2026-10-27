import type { Context } from '@deepseek-ai/cordis';
import type { ContextReport, EnhanceRequest } from '../shared/types.js';
import type { MemoryRecallService } from '../shared/generated/memory-contract.js';
export interface ContextServices {
    extended?(request: EnhanceRequest, signal: AbortSignal): Promise<ContextReport>;
}
export declare function collectContext(ctx: Pick<Context, 'sessionQuery'>, request: EnhanceRequest, signal: AbortSignal, services: ContextServices): Promise<ContextReport>;
export declare function extendedContext(ctx: Pick<Context, 'workspaceRegistry' | 'subprocess'>, memory: MemoryRecallService | undefined, request: EnhanceRequest, signal: AbortSignal): Promise<ContextReport>;
