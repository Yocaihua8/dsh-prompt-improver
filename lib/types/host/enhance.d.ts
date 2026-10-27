import type { Context } from '@deepseek-ai/cordis';
import type { EnhanceRequest, EnhanceResponse } from '../shared/types.js';
import type { ContextServices } from './context.js';
export declare class EnhanceError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}
export declare function validateRequest(request: EnhanceRequest): void;
/** One auxiliary call; never enters the agent loop or appends conversation messages. */
export declare function enhanceDraft(ctx: Pick<Context, 'llm' | 'sessionQuery'>, request: EnhanceRequest, callerSignal: AbortSignal, timeoutMs?: number, services?: ContextServices): Promise<EnhanceResponse>;
