import type { Context } from '@deepseek-ai/cordis';
import type { Capabilities, EnhanceSettings } from '../shared/types.js';
export declare class SettingsClient {
    private readonly ctx;
    readonly enhancing: Set<string>;
    setEnhancing(sessionId: string, busy: boolean): void;
    value: EnhanceSettings;
    capabilities: Capabilities;
    ready: boolean;
    error: string;
    private listeners;
    private loading?;
    private abort;
    constructor(ctx: Context);
    subscribe: (listener: () => void) => (() => void);
    notify(): void;
    load(): Promise<void>;
    refresh(): Promise<void>;
    save(value: EnhanceSettings): Promise<void>;
    dispose(): void;
}
export declare function EnhanceSettingsPage({ settings }: {
    settings: SettingsClient;
}): import("react").JSX.Element;
