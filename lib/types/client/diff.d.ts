/** Word-level diff for the preview panes. Pure functions; no third-party dependency. */
export interface DiffSegment {
    text: string;
    kind: 'same' | 'add' | 'del';
}
export interface DiffResult {
    original: DiffSegment[];
    enhanced: DiffSegment[];
    added: number;
    removed: number;
}
/**
 * Align by lines first, then diff each paired changed line by word so highlights
 * stay readable. Newlines are re-inserted as 'same' separators between lines.
 */
export declare function diffTexts(a: string, b: string): DiffResult;
