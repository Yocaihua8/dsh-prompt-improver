/** The public semantic reference fields from DSH's draft snapshot. */
export interface DraftReference {
    source: string;
    ref: string;
    offset: number;
    length: number;
    label: string;
    clipboardText: string;
    appearance?: 'file' | 'folder' | 'session' | 'skill' | string;
    invalid?: boolean;
}
export interface SemanticDraft {
    text: string;
    references: DraftReference[];
}
export interface ProtectedDraft {
    text: string;
    tokens: string[];
    references: DraftReference[];
}
export declare function protectReferences(draft: SemanticDraft, nonce: string): ProtectedDraft;
export declare function validateTokens(text: string, tokens: readonly string[]): void;
export declare function restoreReferences(text: string, protectedDraft: ProtectedDraft): SemanticDraft;
