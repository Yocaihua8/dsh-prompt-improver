import { mkdir, readFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { withFileLock, writeFileAtomic } from '@deepseek-ai/dsh-atomic-write'
import { DEFAULT_SETTINGS, isEnhanceMode, validateSettings } from '../shared/types.js'
import type { EnhanceSettings } from '../shared/types.js'

export class SettingsStore {
  constructor(private readonly file: string) {}
  async read(legacyMode?: string): Promise<EnhanceSettings> {
    try { return validateSettings(JSON.parse(await readFile(this.file, 'utf8')) as EnhanceSettings) }
    catch (error) {
      if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) {
        throw new Error('读取提示词增强设置失败，请检查设置文件；未覆盖原文件。')
      }
      await mkdir(dirname(this.file), { recursive: true, mode: 0o700 })
      return withFileLock(this.file, async () => {
        try { return validateSettings(JSON.parse(await readFile(this.file, 'utf8')) as EnhanceSettings) }
        catch (error) {
          if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) throw error
        }
        const settings = { ...DEFAULT_SETTINGS, mode: isEnhanceMode(legacyMode) ? legacyMode : DEFAULT_SETTINGS.mode }
        await this.write(settings)
        return settings
      })
    }
  }
  async save(value: EnhanceSettings): Promise<EnhanceSettings> {
    const settings = validateSettings(value)
    await mkdir(dirname(this.file), { recursive: true, mode: 0o700 })
    return withFileLock(this.file, async () => { await this.write(settings); return settings })
  }
  private write(settings: EnhanceSettings): Promise<void> {
    return writeFileAtomic(this.file, JSON.stringify(settings, null, 2) + '\n', { mode: 0o600, dirMode: 0o700 })
  }
}
