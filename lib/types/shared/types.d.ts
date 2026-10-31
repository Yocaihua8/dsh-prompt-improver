import type { UiMessage } from './messages.js';
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
    /** Composer model at click time; gates the mystery injection independently of `selection`. */
    currentSelection?: ModelSelection | null;
}
export interface EnhanceResponse {
    text: string;
    context?: ContextReport;
    selection?: ModelSelection;
}
export interface PredictionRequest {
    sessionId: string;
    draft: string;
    protectedTokens: string[];
    selection: ModelSelection;
    settings: EnhanceSettings;
}
export interface PredictionResponse extends EnhanceResponse {
}
export declare const PREDICTION_CHAR_LIMIT = 200;
export declare const PREDICTION_TIMEOUT_MS = 30000;
export declare const PREDICTION_DEBOUNCE_MS = 800;
export declare const PREDICTION_INTERVAL_MS = 3000;
export interface EnhanceSettings {
    mode: EnhanceMode;
    adoption: 'direct' | 'preview';
    context: 'draft' | 'recent' | 'extended';
    modelStrategy: 'follow' | 'dedicated';
    dedicated: ModelSelection | null;
    /** Prepend the capability declaration when the composer model is DeepSeek. */
    mystery: boolean;
    /** Missing in older clients/settings; normalized to false. */
    predictionEnabled?: boolean;
}
export interface ContextSource {
    kind: 'conversation' | 'memory' | 'project';
    label: string;
    text: string;
    labelMessage?: UiMessage;
}
export interface ContextReport {
    sources: ContextSource[];
    warnings: string[];
    warningMessages?: Array<UiMessage | null>;
}
export interface ModelOption extends ModelSelection {
    label: string;
    efforts: string[];
}
export interface Capabilities {
    owner: boolean;
    memory: boolean;
    personalMemory?: boolean;
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
/** Only the composer model id decides the mystery injection; aliases fall back to "not DeepSeek". */
export declare function isDeepSeekModel(modelId: string | null | undefined): boolean;
export declare function sameSelection(a: ModelSelection | null, b: ModelSelection | null): boolean;
