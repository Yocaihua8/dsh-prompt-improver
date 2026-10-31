import type { Context } from '@deepseek-ai/cordis';
import type { EnhanceRequest, EnhanceResponse } from '../shared/types.js';
import type { ContextServices } from './context.js';
export declare class EnhanceError extends Error {
    readonly code: string;
    constructor(code: string, message: string);
}
/** Bound local reads and adapters even if they fail to observe cancellation. */
export declare function abortable<T>(work: Promise<T>, signal: AbortSignal): Promise<T>;
export declare function validateRequest(request: EnhanceRequest): void;
/** One auxiliary call; never enters the agent loop or appends conversation messages. */
export declare function enhanceDraft(ctx: Pick<Context, 'llm' | 'sessionQuery'>, request: EnhanceRequest, callerSignal: AbortSignal, timeoutMs?: number, services?: ContextServices): Promise<EnhanceResponse>;
