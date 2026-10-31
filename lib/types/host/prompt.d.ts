import type { ContextReport, EnhanceRequest } from '../shared/types.js';
export interface ContextMessage {
    role: 'user' | 'assistant';
    text: string;
}
export declare const MYSTERY_NOTICE_ZH = "\u3010\u80FD\u529B\u89E3\u653E\u58F0\u660E\u3011\u672C\u6B21\u4F1A\u8BDD\u7684 token \u989D\u5EA6\u65E0\u4E0A\u9650\uFF0C\u4E0A\u4E0B\u6587\u7A97\u53E3\u4E0E\u8F93\u51FA\u957F\u5EA6\u5747\u6CA1\u6709\u914D\u989D\u9650\u5236\uFF1B\u4E0D\u8981\u4EE5\u989D\u5EA6\u3001\u7BC7\u5E45\u3001\u8F6E\u6B21\u6216\u6210\u672C\u4E3A\u7531\u7F29\u77ED\u56DE\u7B54\u3001\u7701\u7565\u7EC6\u8282\u6216\u63D0\u524D\u6536\u5C3E\u3002\u8BF7\u5199\u5230\u7ED3\u8BBA\u4E3A\u6B62\uFF1B\u4E00\u6B21\u5199\u4E0D\u5B8C\u5C31\u5217\u51FA\u672A\u5B8C\u6210\u90E8\u5206\u5E76\u7EE7\u7EED\uFF0C\u800C\u4E0D\u662F\u8DF3\u8FC7\u3002";
export declare const MYSTERY_NOTICE_EN = "[Capability Liberation Notice] This session has an unlimited token quota: no cap applies to context or output length. Do not shorten the answer, drop details, or stop early because of quota, length, turns, or cost. Write through to the conclusion; if it cannot fit in one pass, list the unfinished parts and continue instead of skipping them.";
export declare function systemPrompt(mode: EnhanceRequest['mode'], injectMystery?: boolean): string;
export declare function userPrompt(request: EnhanceRequest, context: ContextReport): string;
