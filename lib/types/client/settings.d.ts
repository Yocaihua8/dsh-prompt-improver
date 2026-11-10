import type { Context } from '@deepseek-ai/cordis';
import type { Capabilities, EnhanceSettings } from '../shared/types.js';
export declare class SettingsClient {
    private readonly ctx;
    readonly enhancing: Set<string>;
    setEnhancing(sessionId: string, busy: boolean): void;
    /** 星光菜单齿轮跳转：打开设置页并定位到增强模板 tab。 */
    requestOpenTemplates?: () => void;
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
