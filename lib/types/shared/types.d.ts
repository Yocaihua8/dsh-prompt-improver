export type EnhanceMode = 'moderate' | 'expanded';
export interface ModelSelection {
    provider: string;
    model: string;
    reasoningEffort?: string;
}
export interface EnhanceRequest {
    sessionId: string;
    draft: string;
    mode: EnhanceMode;
    selection: ModelSelection;
    /** Tokens identifying references; identities stay in the browser. */
    protectedTokens: string[];
    /** Immutable settings captured by the client at click time. */
    settings?: EnhanceSettings;
}
export interface EnhanceResponse {
    text: string;
    context?: ContextReport;
    selection?: ModelSelection;
}
export interface EnhanceSettings {
    mode: EnhanceMode;
    adoption: 'direct' | 'preview';
    context: 'draft' | 'recent' | 'extended';
    modelStrategy: 'follow' | 'dedicated';
    dedicated: ModelSelection | null;
}
export interface ContextSource {
    kind: 'conversation' | 'memory' | 'project';
    label: string;
    text: string;
}
export interface ContextReport {
    sources: ContextSource[];
    warnings: string[];
}
export interface ModelOption extends ModelSelection {
    label: string;
    efforts: string[];
}
export interface Capabilities {
    owner: boolean;
    memory: boolean;
    models: ModelOption[];
}
export declare const DEFAULT_SETTINGS: EnhanceSettings;
export declare function validateSettings(value: EnhanceSettings): EnhanceSettings;
export declare function validSelection(value: ModelSelection): boolean;
export declare const TIMEOUT_MS = 120000;
export declare const HISTORY_CHAR_LIMIT = 12000;
export declare const HISTORY_TURN_LIMIT = 3;
export declare const DRAFT_CHAR_LIMIT = 32000;
export declare function isEnhanceMode(value: unknown): value is EnhanceMode;
export declare function sameSelection(a: ModelSelection | null, b: ModelSelection | null): boolean;
