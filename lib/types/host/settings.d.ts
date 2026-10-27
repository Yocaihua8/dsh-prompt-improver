import type { EnhanceSettings } from '../shared/types.js';
export declare class SettingsStore {
    private readonly file;
    constructor(file: string);
    read(legacyMode?: string): Promise<EnhanceSettings>;
    save(value: EnhanceSettings): Promise<EnhanceSettings>;
    private write;
}
