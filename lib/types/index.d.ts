import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { Capabilities, EnhanceRequest, EnhanceResponse, EnhanceSettings } from './shared/types.js';
export type { EnhanceRequest, EnhanceResponse, EnhanceMode, ModelSelection } from './shared/types.js';
declare module '@deepseek-ai/cordis' {
    interface Context {
        promptEnhance: PromptEnhance;
    }
}
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface RemoteErrorDetailsMap {
        'prompt-enhance/failed': {
            reason: string;
        };
    }
}
/** Host service registered by the plugin bundle. */
export default class PromptEnhance extends TypertRemoteService {
    static inject: string[];
    private readonly lifetime;
    private readonly settings;
    private requireOwner;
    constructor(ctx: Context);
    /** Enhance a draft using the selected model and completed recent conversation. */
    enhance(request: EnhanceRequest, signal: AbortSignal): Promise<EnhanceResponse>;
    getSettings(legacyMode: string | undefined, signal: AbortSignal): Promise<EnhanceSettings>;
    saveSettings(settings: EnhanceSettings, signal: AbortSignal): Promise<EnhanceSettings>;
    capabilities(signal: AbortSignal): Promise<Capabilities>;
}
