import { t, m, diagnostic, useLocale } from './i18n.js'
import { useEffect, useId, useRef, useState } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { Button, IconChevronDownOutlineRegular, SegmentedTabs, Switch } from '@deepseek-ai/dsh-client-ui-primitives'
import type { Context } from '@deepseek-ai/cordis'
import type { Capabilities, EnhanceSettings, EnhanceTemplate } from '../shared/types.js'
import { CUSTOM_INSTRUCTION_LIMIT, DEFAULT_SETTINGS, DRAFT_PLACEHOLDER, TEMPLATE_LIMIT, TEMPLATE_NAME_LIMIT, TEMPLATE_TEXT_LIMIT, sameSelection } from '../shared/types.js'

export class SettingsClient {
  readonly enhancing = new Set<string>()
  setEnhancing(sessionId: string, busy: boolean): void {
    if (this.enhancing.has(sessionId) === busy) return
    if (busy) this.enhancing.add(sessionId); else this.enhancing.delete(sessionId)
    this.notify()
  }
  /** 星光菜单齿轮跳转：打开设置页并定位到增强模板 tab。 */
  requestOpenTemplates?: () => void
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
        // This pre-settings-store key must remain readable after the package rename.
        try { legacy = localStorage.getItem('dsh-link-prompt-enhance.mode') ?? undefined } catch { /* Browser storage is optional. */ }
        const result = await this.ctx.remote.promptEnhance.getSettings(legacy, signal)
        if (!result.ok) throw new Error(result.error.message)
        this.value = result.value
      }
      this.ready = true
    } catch (error) { this.error = error instanceof Error ? error.message : m("m050") }
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
    a.modelStrategy === b.modelStrategy && a.mystery === b.mystery && a.predictionEnabled === b.predictionEnabled &&
    (a.customInstructions ?? '') === (b.customInstructions ?? '') && sameSelection(a.dedicated, b.dedicated) &&
    JSON.stringify(a.templates ?? []) === JSON.stringify(b.templates ?? []) &&
    JSON.stringify(a.defaultAction ?? { kind: 'enhance' }) === JSON.stringify(b.defaultAction ?? { kind: 'enhance' })
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <span className="dsh-prompt-enhance-select"><select {...props} /><IconChevronDownOutlineRegular size={14} aria-hidden="true" /></span>
}

const contextHelp = {
  get draft() { return t("m051") },
  get recent() { return t("m052") },
  get extended() { return t("m053") },
} as const

/** Non-owners always run the defaults; show them read-only instead of an empty page. */
function ReadOnlySettings() {
  useLocale()
  const rows: Array<[string, string]> = [
    [t("m061"), t("m011")],
    [t("m064"), t("m065")],
    [t("m163"), t("m166")],
    [t("m190"), t("m191")],
    [t("m182"), t("m206")],
    [t("m080"), t("m014")],
    [t("m082"), t("m027")],
    [t("m069"), t("m166")],
    [t("m072"), t("m166")],
  ]
  return <div className="dsh-prompt-enhance-readonly">
    <h3>{t("m167")}</h3>
    <dl>{rows.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
    <p>{t("m059")}</p>
  </div>
}

/** 模板行内编辑卡状态。 */
interface TemplateEditor { id?: string; name: string; text: string }

export function EnhanceSettingsPage({ settings }: { settings: SettingsClient }) {
  useLocale()
  const id = useId()
  const [draft, setDraft] = useState<EnhanceSettings>(() => structuredClone(settings.value))
  const baseline = useRef(settings.value)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState<'save' | 'refresh' | null>(null)
  const [, render] = useState(0)
  // 两 tab：增强偏好（旧四分区合并）| 增强模板
  type SettingsTab = 'preference' | 'templates'
  const [activeTab, setActiveTab] = useState<SettingsTab>('preference')
  const [templateEditor, setTemplateEditor] = useState<TemplateEditor | null>(null)
  const [templateError, setTemplateError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  // 星光菜单齿轮跳转：打开时定位到增强模板 tab。
  useEffect(() => {
    settings.requestOpenTemplates = () => { setActiveTab('templates'); render(n => n + 1) }
    return () => { settings.requestOpenTemplates = undefined }
  }, [settings])
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
  const updateTemplate = (id: string, next: EnhanceTemplate) => {
    setDraft(current => ({ ...current, templates: (current.templates ?? []).map(template => template.id === id ? next : template) }))
    setMessage('')
  }
  const models = settings.capabilities.models
  const selected = models.find(model => model.provider === draft.dedicated?.provider && model.model === draft.dedicated.model)
  const selectedKey = draft.dedicated ? JSON.stringify([draft.dedicated.provider, draft.dedicated.model]) : ''
  const invalidModel = draft.modelStrategy === 'dedicated' && !selected
  const invalidEffort = draft.modelStrategy === 'dedicated' && !!draft.dedicated?.reasoningEffort && !selected?.efforts.includes(draft.dedicated.reasoningEffort)
  const dirty = !sameSettings(draft, settings.value)
  const templates = draft.templates ?? []
  const defaultAction = draft.defaultAction
  const status = busy === 'save' ? t("m054") : busy === 'refresh' ? t("m055") : !settings.ready ? t("m056") : dirty ? t("m057") : t("m058")
  const saveTemplateEditor = () => {
    if (!templateEditor) return
    const name = templateEditor.name.trim()
    const text = templateEditor.text.trim()
    if (!name) return setTemplateError(t("m199"))
    if (name.length > TEMPLATE_NAME_LIMIT) return setTemplateError(t("m196") + ` ≤ ${TEMPLATE_NAME_LIMIT}`)
    if (!text) return setTemplateError(t("m200"))
    if (text.length > TEMPLATE_TEXT_LIMIT) return setTemplateError(t("m197") + ` ≤ ${TEMPLATE_TEXT_LIMIT.toLocaleString()}`)
    if (text.split(DRAFT_PLACEHOLDER).length - 1 !== 1) return setTemplateError(t("m201", { draft: DRAFT_PLACEHOLDER }))
    setDraft(current => {
      const list = current.templates ?? []
      const templates = templateEditor.id
        ? list.map(template => template.id === templateEditor.id ? { ...template, name, text } : template)
        : list.length >= TEMPLATE_LIMIT ? list : [...list, { id: crypto.randomUUID(), name, text }]
      return { ...current, templates }
    })
    setTemplateEditor(null)
    setTemplateError('')
    setMessage('')
  }
  return <div className="dsh-prompt-enhance-settings">
    <div className="dsh-prompt-enhance-header">
      <h2>{t("m045")}</h2>
      <Button variant="ghost" disabled={busy !== null} onClick={() => { setMessage(''); setBusy('refresh'); void settings.refresh().finally(() => setBusy(null)) }}>{t("m097")}</Button>
    </div>
    {settings.ready && !settings.capabilities.owner ? <ReadOnlySettings /> : <fieldset disabled={busy !== null || !settings.ready}>
      <SegmentedTabs size="sm" label={t("m045")}
        items={[
          { value: 'preference' as const, label: t("m060"), id: `${id}-tab-preference`, panelId: `${id}-panel-preference` },
          { value: 'templates' as const, label: t("m182"), id: `${id}-tab-templates`, panelId: `${id}-panel-templates` },
        ]}
        value={activeTab} onChange={setActiveTab} />
      {activeTab === 'preference' && <div id={`${id}-panel-preference`} role="tabpanel" aria-labelledby={`${id}-tab-preference`}>
      <section className="dsh-prompt-enhance-group" aria-labelledby={`${id}-preference`}>
        <h3 id={`${id}-preference`}>{t("m060")}</h3>
        <div className="dsh-prompt-enhance-choices" role="group" aria-label={t("m061")}>
          <label className="dsh-prompt-enhance-choice"><input type="radio" name={`${id}-mode`} value="moderate" checked={draft.mode === 'moderate'} onChange={() => update('mode', 'moderate')} /><span>{t("m011")}<small>{t("m062")}</small></span></label>
          <label className="dsh-prompt-enhance-choice"><input type="radio" name={`${id}-mode`} value="expanded" checked={draft.mode === 'expanded'} onChange={() => update('mode', 'expanded')} /><span>{t("m012")}<small>{t("m063")}</small></span></label>
        </div>
        <label className="dsh-prompt-enhance-setting-row">{t("m064")}<Select value={draft.adoption} onChange={event => update('adoption', event.target.value as EnhanceSettings['adoption'])}>
          <option value="direct">{t("m065")}</option><option value="preview">{t("m066")}</option>
        </Select></label>
        <p>{draft.adoption === 'direct' ? t("m067") : t("m068")}</p>
        <label className="dsh-prompt-enhance-setting-row dsh-prompt-enhance-custom-row">{t("m163")}<textarea value={draft.customInstructions ?? ''} maxLength={CUSTOM_INSTRUCTION_LIMIT} rows={3}
          onChange={event => update('customInstructions', event.target.value)}
          onBlur={event => { const value = event.target.value.trim(); if (value !== event.target.value) update('customInstructions', value || undefined) }} /></label>
        <p>{t("m164", { p0: CUSTOM_INSTRUCTION_LIMIT.toLocaleString() })}</p>
        <div className="dsh-prompt-enhance-feature dsh-prompt-enhance-feature-inset" role="group" aria-labelledby={`${id}-mystery`}>
          <div className="dsh-prompt-enhance-feature-heading">
            <div className="dsh-prompt-enhance-feature-copy">
              <h3 id={`${id}-mystery`}>{t("m069")}</h3>
              <p>{t("m070")}</p>
            </div>
            <Switch label={t("m069")} checked={draft.mystery} disabled={busy !== null || !settings.ready} onChange={value => update('mystery', value)} />
          </div>
          <p className="dsh-prompt-enhance-scope-note"><span className="dsh-prompt-enhance-model-tag">DeepSeek</span>{t("m071")}</p>
        </div>
      </section>
      <section className="dsh-prompt-enhance-group dsh-prompt-enhance-feature" aria-labelledby={`${id}-prediction`}>
        <div className="dsh-prompt-enhance-feature-heading">
          <div className="dsh-prompt-enhance-feature-copy">
            <h3 id={`${id}-prediction`}>{t("m072")}</h3>
            <p>{t("m073")}</p>
          </div>
          <Switch label={t("m072")} checked={draft.predictionEnabled === true} disabled={busy !== null || !settings.ready} onChange={value => update('predictionEnabled', value)} />
        </div>
        <div className="dsh-prompt-enhance-keyboard-help" aria-label={t("m074")}>
          <span><kbd>Tab</kbd> {t("m075")}</span><span><kbd>Alt+→</kbd> {t("m176")}</span><span><kbd>Esc</kbd> {t("m076")}</span><span><kbd>Alt+\</kbd> {t("m175")}</span><span className="dsh-prompt-enhance-send-note">{t("m077")}</span>
        </div>
        <p className="dsh-prompt-enhance-usage-note">{t("m078")}</p>
        {draft.predictionEnabled && !settings.capabilities.personalMemory && <p role="status">{t("m079")}</p>}
      </section>
      <section className="dsh-prompt-enhance-group" aria-labelledby={`${id}-context`}>
        <h3 id={`${id}-context`}>{t("m080")}</h3>
        <div className="dsh-prompt-enhance-choices dsh-prompt-enhance-context-choices" role="group" aria-label={t("m080")}>
          {([['draft', t("m013")], ['recent', t("m014")], ['extended', t("m015")]] as const).map(([value, label]) => <label className="dsh-prompt-enhance-choice" key={value}><input type="radio" name={`${id}-context`} value={value} checked={draft.context === value} onChange={() => update('context', value)} /><span>{label}</span></label>)}
        </div>
        <p>{contextHelp[draft.context]}</p>
        {draft.context === 'extended' && !settings.capabilities.memory && <p role="status">{t("m081")}</p>}
      </section>
      <section className="dsh-prompt-enhance-group" aria-label={t("m082")}>
        <label className="dsh-prompt-enhance-setting-row">{t("m082")}<Select value={draft.modelStrategy} onChange={event => update('modelStrategy', event.target.value as EnhanceSettings['modelStrategy'])}>
          <option value="follow">{t("m027")}</option><option value="dedicated">{t("m083")}</option>
        </Select></label>
        <p>{draft.modelStrategy === 'follow' ? t("m084") : t("m085")}</p>
        {draft.modelStrategy === 'dedicated' && <div className="dsh-prompt-enhance-model-fields">
          <label>{t("m028")}<Select value={selectedKey} aria-invalid={invalidModel} onChange={event => {
            const model = models.find(model => JSON.stringify([model.provider, model.model]) === event.target.value)
            update('dedicated', model ? { provider: model.provider, model: model.model } : null)
          }}><option value="">{t("m086")}</option>
            {selectedKey && !selected && <option value={selectedKey}>{t("m087")}</option>}
            {models.map(model => <option key={JSON.stringify([model.provider, model.model])} value={JSON.stringify([model.provider, model.model])}>{model.label}</option>)}
          </Select></label>
          <label>{t("m088")}<Select value={draft.dedicated?.reasoningEffort ?? ''} disabled={!selected} aria-invalid={invalidEffort} onChange={event => {
            if (draft.dedicated) update('dedicated', { provider: draft.dedicated.provider, model: draft.dedicated.model, ...(event.target.value ? { reasoningEffort: event.target.value } : {}) })
          }}><option value="">{t("m089")}</option>{selected?.efforts.map(effort => <option key={effort} value={effort}>{effort}</option>)}
            {draft.dedicated?.reasoningEffort && !selected?.efforts.includes(draft.dedicated.reasoningEffort) && <option value={draft.dedicated.reasoningEffort}>{t("m090")}</option>}
          </Select></label>
        </div>}
        {(invalidModel || invalidEffort) && <p className="dsh-prompt-enhance-warning" role="alert">{invalidModel ? t("m091") : t("m092")}{t("m093")}</p>}
      </section>
      </div>}
      {activeTab === 'templates' && <div id={`${id}-panel-templates`} role="tabpanel" aria-labelledby={`${id}-tab-templates`}>
      <section className="dsh-prompt-enhance-group" aria-labelledby={`${id}-templates`}>
        <h3 id={`${id}-templates`}>{t("m194", { p0: templates.length.toLocaleString(), p1: TEMPLATE_LIMIT.toLocaleString() })}</h3>
        <label className="dsh-prompt-enhance-setting-row">{t("m190")}<Select value={JSON.stringify(defaultAction ?? { kind: 'enhance' })} onChange={event => {
          try { update('defaultAction', JSON.parse(event.target.value)) } catch { /* 忽略非法值，保持现状 */ }
        }}>
          <option value={JSON.stringify({ kind: 'enhance' })}>{t("m191")}</option>
          {templates.flatMap(template => [
            <option key={`${template.id}-apply`} value={JSON.stringify({ kind: 'template-apply', templateId: template.id })}>{t("m192", { p0: template.name })}</option>,
            <option key={`${template.id}-adapt`} value={JSON.stringify({ kind: 'template-adapt', templateId: template.id })}>{t("m193", { p0: template.name })}</option>,
          ])}
        </Select></label>
        {templateEditor === null && <Button variant="ghost" onClick={() => { setTemplateEditor({ name: '', text: `请基于以下内容：\n${DRAFT_PLACEHOLDER}` }); setTemplateError('') }}>{t("m195")}</Button>}
        {templateEditor !== null && <div className="dsh-prompt-enhance-template-editor">
          <label className="dsh-prompt-enhance-setting-row">{t("m196")}
            <input value={templateEditor.name} maxLength={TEMPLATE_NAME_LIMIT + 10} data-prompt-template-name
              onChange={event => setTemplateEditor({ ...templateEditor, name: event.target.value })} />
          </label>
          <label className="dsh-prompt-enhance-setting-row">{t("m197")}
            <textarea rows={5} value={templateEditor.text} data-prompt-template-text
              placeholder={t("m198", { p0: TEMPLATE_TEXT_LIMIT.toLocaleString(), draft: DRAFT_PLACEHOLDER })}
              onChange={event => setTemplateEditor({ ...templateEditor, text: event.target.value })} />
          </label>
          {templateError && <p className="dsh-prompt-enhance-warning" role="alert">{templateError}</p>}
          <div className="dsh-prompt-enhance-template-actions">
            <Button variant="ghost" onClick={() => { setTemplateEditor(null); setTemplateError('') }}>{t("m209")}</Button>
            <Button variant="primary" onClick={saveTemplateEditor}>{t("m210")}</Button>
          </div>
        </div>}
        {templateEditor === null && <>
          {templates.length === 0 && <p role="status">{t("m204")}</p>}
          {templates.map(template => <div className="dsh-prompt-enhance-template-row" key={template.id}>
            <strong>{template.name}</strong>
            <span className="dsh-prompt-enhance-template-preview">{template.text.replace(DRAFT_PLACEHOLDER, '〔draft〕').slice(0, 40)}</span>
            <Button variant="ghost" size="sm" aria-label={`${t("m205", { p0: template.name })}`} onClick={() => { setTemplateEditor({ id: template.id, name: template.name, text: template.text }); setTemplateError('') }}>{t("m205", { p0: template.name }).slice(0, 2)}</Button>
            {deletingId === template.id
              ? <Button size="sm" onClick={() => {
                  setDraft(current => ({ ...current, templates: (current.templates ?? []).filter(candidate => candidate.id !== template.id), ...(current.defaultAction && current.defaultAction.kind !== 'enhance' && current.defaultAction.templateId === template.id ? { defaultAction: undefined } : {}) }))
                  setDeletingId(null)
                  setMessage(t("m203"))
                }}>{t("m202")}</Button>
              : <Button variant="ghost" size="sm" aria-label={`${t("m202")}: ${template.name}`} onClick={() => { setDeletingId(template.id); setTimeout(() => setDeletingId(current => current === template.id ? null : current), 3500) }}>{t("m094").slice(0, 2)}</Button>}
          </div>)}
        </>}
      </section>
      </div>}
      <div className="dsh-prompt-enhance-settings-footer">
        <span role="status" className="dsh-prompt-enhance-save-status">{status}</span>
        <Button variant="ghost" disabled={!dirty} onClick={() => { setDraft(structuredClone(settings.value)); setTemplateEditor(null); setDeletingId(null); setMessage('') }}>{t("m094")}</Button>
        <Button variant="primary" disabled={!dirty || invalidModel || invalidEffort} onClick={() => {
          setBusy('save'); setMessage('')
          const payload = { ...structuredClone(draft), customInstructions: draft.customInstructions?.trim() || undefined }
          void settings.save(payload).then(() => setDraft(structuredClone(settings.value)))
            .catch(error => setMessage(error instanceof Error ? error.message : m("m095"))).finally(() => setBusy(null))
        }}>{t("m096")}</Button>
      </div>
    </fieldset>}
    {(message || settings.error) && <p className="dsh-prompt-enhance-warning" role="alert">{diagnostic(message || settings.error)}</p>}
  </div>
}
