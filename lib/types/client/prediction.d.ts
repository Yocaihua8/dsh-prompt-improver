import type { Context } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { InputActions } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { SettingsClient } from './settings.js';
/** Compare DOM boundaries, not text offsets: reference chips have a separate detect projection. */
export declare function caretAtEnd(editor: HTMLElement): boolean;
/** Scoped adapter for the rc.3 resident input DOM. Never changes Lexical's document. */
export declare function mountPredictionView(editor: HTMLElement, badge: HTMLElement): {
    show(text: string, message: string): void;
    dispose(): void;
};
export declare function PredictionOverlay({ ctx, sessionId, settings, inputActions }: {
    ctx: Context;
    sessionId: SessionId;
    settings: SettingsClient;
    inputActions: InputActions;
}): import("react").JSX.Element;
