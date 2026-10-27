import type { ContextReport, EnhanceRequest } from '../shared/types.js';
export interface ContextMessage {
    role: 'user' | 'assistant';
    text: string;
}
export declare function systemPrompt(mode: EnhanceRequest['mode']): string;
export declare function userPrompt(request: EnhanceRequest, context: ContextReport): string;
