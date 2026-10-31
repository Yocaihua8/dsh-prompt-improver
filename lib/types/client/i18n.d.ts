import type { Context } from '@deepseek-ai/cordis';
import { type Args, type MessageKey, type UiMessage } from '../shared/messages.js';
export { m } from '../shared/messages.js';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'dsh-prompt-improver': MessageKey;
    }
}
export declare const subscribeLocale: (listener: () => void) => (() => void);
export declare const localeId: () => string;
export declare const formatLocale: () => string;
export declare function useLocale(): string;
/** Native locale subscriptions only repaint; they never touch business controllers or requests. */
export declare function installLocale(ctx: Context): void;
export declare function t<K extends MessageKey>(key: K, ...[params]: Args<K>): string;
export declare function localize(message: string, descriptor?: UiMessage, depth?: number): string;
export declare function diagnostic(message: string, descriptor?: UiMessage): string;
/** Isolated component tests use the same dictionaries without persisting host preferences. */
export declare function setTestLocale(locale: 'zh' | 'en'): void;
export declare function dateLabel(value: string): string;
export declare function unit(count: number | null, singular: string, plural?: string): string;
export declare function sourceLabel(source: {
    kind: string;
    label: string;
    labelMessage?: UiMessage;
}): string;
