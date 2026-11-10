import type { PredictionRequest, PredictionResponse } from '../shared/types.js';
export interface PredictionSnapshot {
    /** Includes session generation, draft revision, references, attachments, model, settings, and context. */
    key: string;
    /** Semantic identity omits the monotonic revision, so undo does not repeat a dismissed suggestion. */
    dedupeKey?: string;
    eligible: boolean;
    request: PredictionRequest | null;
}
export interface PredictionPort {
    read(): PredictionSnapshot;
    predict(request: PredictionRequest, signal: AbortSignal): Promise<PredictionResponse>;
    insert(text: string): boolean;
    changed(): void;
    now?(): number;
}
/** Split a suggestion into the first segmented word (with trailing spaces) and the remainder. */
export declare function splitSuggestionHead(suggestion: string): {
    head: string;
    rest: string;
};
/** Presentation never writes a draft; only accept()/acceptWord() can call insert. */
export declare class PredictionController {
    private readonly port;
    suggestion: string;
    message: string;
    private key;
    private readonly attempted;
    private readonly shown;
    private backoff;
    private timer?;
    private active?;
    private lastStart;
    private disposed;
    constructor(port: PredictionPort);
    get pending(): boolean;
    private now;
    reconcile(): void;
    private start;
    accept(): boolean;
    /** Tab-equivalent for the remaining suggestion after acceptWord kept it visible. */
    acceptWord(): boolean;
    /** Alt+\: force one prediction for the current snapshot, bypassing the content dedupe and the backoff once. */
    manualTrigger(): void;
    dismiss(): void;
    private rememberShown;
    private remember;
    private stop;
    dispose(): void;
}
