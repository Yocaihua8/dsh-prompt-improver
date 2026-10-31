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
/** Presentation never writes a draft; only accept() can call insert. */
export declare class PredictionController {
    private readonly port;
    suggestion: string;
    message: string;
    private key;
    private readonly attempted;
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
    dismiss(): void;
    private remember;
    private stop;
    dispose(): void;
}
