import { useEffect, useId, useRef, useState } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { Button, IconChevronDownOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { Context } from '@deepseek-ai/cordis'
import type { Capabilities, EnhanceSettings } from '../shared/types.js'
import { DEFAULT_SETTINGS, sameSelection } from '../shared/types.js'

export class SettingsClient {
  value: EnhanceSettings = structuredClone(DEFAULT_SETTINGS)
  capabilities: Capabilities = { owner: false, memory: false, models: [] }
  ready = false
  error = ''
  private listeners = new Set<() => void>()
  private loading?: Promise<void>
  private abort = new AbortController()
  constructor(private readonly ctx: Context) {}
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  notify(): void { for (const listener of this.listeners) listener() }
  async load(): Promise<void> {
    if (this.ready) return
    return this.loading ??= this.refresh().finally(() => { this.loading = undefined })
  }
  async refresh(): Promise<void> {
    this.error = ''
    try {
      const signal = AbortSignal.any([this.abort.signal, AbortSignal.timeout(15000)])
      const capabilities = await this.ctx.remote.promptEnhance.capabilities(signal)
      if (!capabilities.ok) throw new Error(capabilities.error.message)
      this.capabilities = capabilities.value
      if (capabilities.value.owner) {
        let legacy: string | undefined
        try { legacy = localStorage.getItem('dsh-link-prompt-enhance.mode') ?? undefined } catch { /* Browser storage is optional. */ }
        const result = await this.ctx.remote.promptEnhance.getSettings(legacy, signal)
        if (!result.ok) throw new Error(result.error.message)
        this.value = result.value
      }
      this.ready = true
    } catch (error) { this.error = error instanceof Error ? error.message : '读取设置失败。' }
    if (!this.abort.signal.aborted) this.notify()
  }
  async save(value: EnhanceSettings): Promise<void> {
    const result = await this.ctx.remote.promptEnhance.saveSettings(value, AbortSignal.any([this.abort.signal, AbortSignal.timeout(15000)]))
    if (!result.ok) throw new Error(result.error.message)
    this.value = result.value; this.error = ''; this.notify()
  }
  dispose(): void { this.abort.abort(); this.listeners.clear() }
}

function sameSettings(a: EnhanceSettings, b: EnhanceSettings): boolean {
  return a.mode === b.mode && a.adoption === b.adoption && a.context === b.context &&
    a.modelStrategy === b.modelStrategy && sameSelection(a.dedicated, b.dedicated)
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <span className="dsh-prompt-enhance-select"><select {...props} /><IconChevronDownOutlineRegular size={14} aria-hidden="true" /></span>
}

const contextHelp = {
  draft: '只发送当前草稿，不读取对话、记忆或项目文件。',
  recent: '参考最近 3 轮已完成对话，随草稿发送给增强模型。',
  extended: '参考对话、个人及同项目记忆、当前项目片段，并发送给增强模型。不会写入记忆。',
} as const

export function EnhanceSettingsPage({ settings }: { settings: SettingsClient }) {
  const id = useId()
  const [draft, setDraft] = useState<EnhanceSettings>(() => structuredClone(settings.value))
  const baseline = useRef(settings.value)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState<'save' | 'refresh' | null>(null)
  const [, render] = useState(0)
  useEffect(() => {
    let mounted = true
    const stop = settings.subscribe(() => {
      const previous = baseline.current, next = settings.value
      // Refresh capabilities without discarding an unfinished settings edit.
      setDraft(current => sameSettings(current, previous) ? structuredClone(next) : current)
      baseline.current = next
      render(n => n + 1)
    })
    setBusy('refresh')
    void settings.refresh().finally(() => { if (mounted) setBusy(null) })
    return () => { mounted = false; stop() }
  }, [settings])
  const update = <K extends keyof EnhanceSettings>(key: K, value: EnhanceSettings[K]) => { setDraft(current => ({ ...current, [key]: value })); setMessage('') }
  const models = settings.capabilities.models
  const selected = models.find(model => model.provider === draft.dedicated?.provider && model.model === draft.dedicated.model)
  const selectedKey = draft.dedicated ? JSON.stringify([draft.dedicated.provider, draft.dedicated.model]) : ''
  const invalidModel = draft.modelStrategy === 'dedicated' && !selected
  const invalidEffort = draft.modelStrategy === 'dedicated' && !!draft.dedicated?.reasoningEffort && !selected?.efforts.includes(draft.dedicated.reasoningEffort)
  const dirty = !sameSettings(draft, settings.value)
  const status = busy === 'save' ? '正在保存…' : busy === 'refresh' ? '正在刷新…' : !settings.ready ? '尚未读取设置' : dirty ? '有未保存的修改' : '设置已保存'
  return <div className="dsh-prompt-enhance-settings">
    <h2>提示词增强</h2>
    {settings.ready && !settings.capabilities.owner ? <p>仅宿主所有者可以管理设置和使用扩展上下文。</p> : <fieldset disabled={busy !== null || !settings.ready}>
      <section className="dsh-prompt-enhance-group" aria-labelledby={`${id}-preference`}>
        <h3 id={`${id}-preference`}>增强偏好</h3>
        <div className="dsh-prompt-enhance-choices" role="group" aria-label="增强方式">
          <label className="dsh-prompt-enhance-choice"><input type="radio" name={`${id}-mode`} value="moderate" checked={draft.mode === 'moderate'} onChange={() => update('mode', 'moderate')} /><span>适度增强<small>理清表达，保留原意</small></span></label>
          <label className="dsh-prompt-enhance-choice"><input type="radio" name={`${id}-mode`} value="expanded" checked={draft.mode === 'expanded'} onChange={() => update('mode', 'expanded')} /><span>充分展开<small>补充结构与必要细节</small></span></label>
        </div>
        <label className="dsh-prompt-enhance-setting-row">增强后<Select value={draft.adoption} onChange={event => update('adoption', event.target.value as EnhanceSettings['adoption'])}>
          <option value="direct">直接替换草稿</option><option value="preview">先预览，再决定</option>
        </Select></label>
        <p>{draft.adoption === 'direct' ? '替换后可恢复原文，不会自动发送。' : '查看增强稿，确认后再替换当前输入。'}</p>
      </section>
      <section className="dsh-prompt-enhance-group" aria-labelledby={`${id}-context`}>
        <h3 id={`${id}-context`}>参考范围</h3>
        <div className="dsh-prompt-enhance-choices dsh-prompt-enhance-context-choices" role="group" aria-label="参考范围">
          {([['draft', '仅草稿'], ['recent', '最近对话'], ['extended', '扩展上下文']] as const).map(([value, label]) => <label className="dsh-prompt-enhance-choice" key={value}><input type="radio" name={`${id}-context`} value={value} checked={draft.context === value} onChange={() => update('context', value)} /><span>{label}</span></label>)}
        </div>
        <p>{contextHelp[draft.context]}</p>
        {draft.context === 'extended' && !settings.capabilities.memory && <p role="status">记忆服务当前不可用；增强时会显示实际缺少的来源。</p>}
      </section>
      <section className="dsh-prompt-enhance-group" aria-label="增强模型">
        <label className="dsh-prompt-enhance-setting-row">增强模型<Select value={draft.modelStrategy} onChange={event => update('modelStrategy', event.target.value as EnhanceSettings['modelStrategy'])}>
          <option value="follow">跟随当前模型</option><option value="dedicated">指定专用模型</option>
        </Select></label>
        <p>{draft.modelStrategy === 'follow' ? '使用会话中已选择的模型与推理档位。' : '从宿主可用模型中选择；不会自动换用其他模型。'}</p>
        {draft.modelStrategy === 'dedicated' && <div className="dsh-prompt-enhance-model-fields">
          <label>专用模型<Select value={selectedKey} aria-invalid={invalidModel} onChange={event => {
            const model = models.find(model => JSON.stringify([model.provider, model.model]) === event.target.value)
            update('dedicated', model ? { provider: model.provider, model: model.model } : null)
          }}><option value="">选择可用模型</option>
            {selectedKey && !selected && <option value={selectedKey}>已保存模型不可用，请重新选择</option>}
            {models.map(model => <option key={JSON.stringify([model.provider, model.model])} value={JSON.stringify([model.provider, model.model])}>{model.label}</option>)}
          </Select></label>
          <label>推理档位<Select value={draft.dedicated?.reasoningEffort ?? ''} disabled={!selected} aria-invalid={invalidEffort} onChange={event => {
            if (draft.dedicated) update('dedicated', { provider: draft.dedicated.provider, model: draft.dedicated.model, ...(event.target.value ? { reasoningEffort: event.target.value } : {}) })
          }}><option value="">模型默认</option>{selected?.efforts.map(effort => <option key={effort} value={effort}>{effort}</option>)}
            {draft.dedicated?.reasoningEffort && !selected?.efforts.includes(draft.dedicated.reasoningEffort) && <option value={draft.dedicated.reasoningEffort}>已保存档位不可用</option>}
          </Select></label>
        </div>}
        {(invalidModel || invalidEffort) && <p className="dsh-prompt-enhance-warning" role="alert">{invalidModel ? '专用模型不可用，请重新选择。' : '推理档位不可用，请重新选择。'}不会自动换用其他模型。</p>}
      </section>
      <div className="dsh-prompt-enhance-settings-footer">
        <span role="status" className="dsh-prompt-enhance-save-status">{status}</span>
        <Button variant="ghost" disabled={!dirty} onClick={() => { setDraft(structuredClone(settings.value)); setMessage('') }}>取消</Button>
        <Button variant="primary" disabled={!dirty || invalidModel || invalidEffort} onClick={() => {
          setBusy('save'); setMessage('')
          void settings.save(structuredClone(draft)).then(() => setDraft(structuredClone(settings.value)))
            .catch(error => setMessage(error instanceof Error ? error.message : '保存失败。')).finally(() => setBusy(null))
        }}>保存设置</Button>
      </div>
    </fieldset>}
    {(message || settings.error) && <p className="dsh-prompt-enhance-warning" role="alert">{message || settings.error}</p>}
    <Button variant="ghost" disabled={busy !== null} onClick={() => { setMessage(''); setBusy('refresh'); void settings.refresh().finally(() => setBusy(null)) }}>刷新模型与设置</Button>
  </div>
}
