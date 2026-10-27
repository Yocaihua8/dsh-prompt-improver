import type { ContextMessage } from './prompt.js';
export interface HistoryEvent {
    seq: number;
    type: string;
    data: unknown;
}
/** Use the current surface for content, raw lifecycle events only for turn membership. */
export declare function recentConversation(surface: readonly HistoryEvent[], raw: readonly HistoryEvent[], capturedThroughSeq: number | null, charLimit?: number): ContextMessage[];
