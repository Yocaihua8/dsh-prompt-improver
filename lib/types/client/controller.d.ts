import type { SemanticDraft } from '../shared/references.js';
import type { EnhanceMode, EnhanceRequest, EnhanceResponse, EnhanceSettings, ModelSelection } from '../shared/types.js';
export interface ComposerSnapshot {
    sessionId: string;
    revision: number;
    draft: SemanticDraft;
    attachmentIds: readonly string[];
    selection: ModelSelection | null;
    /** Composer model; the mystery injection is gated on it, not on `selection`. */
    current: ModelSelection | null;
    available: boolean;
}
export interface ControllerPort {
    read(): ComposerSnapshot;
    write(draft: SemanticDraft): void;
    enhance(request: EnhanceRequest, signal: AbortSignal): Promise<EnhanceResponse>;
    changed(): void;
    nonce(): string;
    validateSelection?(selection: ModelSelection, signal: AbortSignal): Promise<boolean>;
}
export interface Preview {
    snapshot: ComposerSnapshot;
    draft: SemanticDraft;
    response: EnhanceResponse;
}
/** Owns asynchronous requests independently of React render timing. */
export declare class EnhanceController {
    private readonly port;
    private active?;
    private undo?;
    private disposed;
    preview?: Preview;
    private applying?;
    message: string;
    constructor(port: ControllerPort);
    get pending(): boolean;
    get checkingPreview(): boolean;
    get canUndo(): boolean;
    reconcile(): void;
    cancel(message?: string): void;
    start(mode: EnhanceMode, settings?: EnhanceSettings, previewOnce?: boolean): Promise<void>;
    private apply;
    acceptPreview(): Promise<void>;
    closePreview(): void;
    restore(): void;
    dispose(): void;
}
