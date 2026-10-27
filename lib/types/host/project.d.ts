import type { Context } from '@deepseek-ai/cordis';
import type { ContextReport } from '../shared/types.js';
export declare function allowedProjectFile(path: string): boolean;
export declare function searchTerms(draft: string): string[];
export declare function safeFile(root: string, path: string): Promise<string | null>;
/** Bounded lexical retrieval, with no shell, model call, index or workspace argument from the client. */
export declare function searchProject(ctx: Pick<Context, 'subprocess'>, root: string, draft: string, caller: AbortSignal): Promise<ContextReport>;
