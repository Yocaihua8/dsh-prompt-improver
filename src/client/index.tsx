import { sourceLabel, installLocale, t, m, localize, diagnostic, useLocale } from './i18n.js'
import type { Context } from '@deepseek-ai/cordis'
import { useEffect, useLayoutEffect, useMemo, useReducer, useState } from 'react'
import { Button, Modal, Toast } from '@deepseek-ai/dsh-client-ui-primitives'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-api-gateway/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { DraftInput } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { TYPERT_REMOTE } from '../../lib/typert.remote-client.js'
import { EnhanceController } from './controller.js'
import { EnhanceSettingsPage, SettingsClient } from './settings.js'
import type { ControllerPort } from './controller.js'
import { DRAFT_CHAR_LIMIT } from '../shared/types.js'
import styles from './style.css'
import { PredictionOverlay } from './prediction.js'

const labels = { get moderate() { return t("m011") }, get expanded() { return t("m012") } } as const
const contextLabels = { get draft() { return t("m013") }, get recent() { return t("m014") }, get extended() { return t("m015") } } as const

interface ViewBinding extends Omit<ControllerPort, 'changed' | 'nonce'> {
  subscribe(listener: () => void): () => void
  reason(): string
}

function EnhanceIcon({ pending, restore }: { pending: boolean; restore: boolean }) {
  return <svg className="dsh-prompt-enhance-icon" width={restore ? 16 : 18} height={restore ? 16 : 18} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={restore ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false">
    {pending ? <>
      <circle className="dsh-prompt-enhance-progress" cx="12" cy="12" r="9" strokeDasharray="42 15" />
      <path d="m9 9 6 6m0-6-6 6" />
    </> : restore ? <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
    </> : <>
      <path d="M9.6 5.4 11.76 10.44 16.8 12.6 11.76 14.76 9.6 19.8 7.44 14.76 2.4 12.6 7.44 10.44Z" />
      <path d="M18 4.2 19.08 6.72 21.6 7.8 19.08 8.88 18 11.4 16.92 8.88 14.4 7.8 16.92 6.72Z" />
    </>}
  </svg>
}

function EnhanceButton({ binding, settings }: { binding: ViewBinding; settings: SettingsClient }) {
  useLocale()
  const [, render] = useReducer((n: number) => n + 1, 0)
  const [compareOriginal, setCompareOriginal] = useState(true)
  const [previewSettings, setPreviewSettings] = useState(settings.value)
  const [dismissed, setDismissed] = useState('')
  const controller = useMemo(() => new EnhanceController({ ...binding, changed: render, nonce: () => crypto.randomUUID() }), [binding])
  useLayoutEffect(() => {
    const unsubscribe = binding.subscribe(() => { controller.reconcile(); render() })
    return () => { unsubscribe(); controller.dispose() }
  }, [binding, controller])
  useEffect(() => {
    const stop = settings.subscribe(() => { controller.reconcile(); render() })
    void settings.load()
    return stop
  }, [settings, controller])

  const reason = binding.reason()
  const mode = settings.value.mode
  const pending = controller.pending
  const canUndo = controller.canUndo
  const enhanceSessionId = binding.read().sessionId
  useLayoutEffect(() => { settings.setEnhancing(enhanceSessionId, pending || !!controller.preview || controller.checkingPreview) })
  useEffect(() => () => settings.setEnhancing(enhanceSessionId, false), [settings, enhanceSessionId])
  const selection = controller.preview?.response.selection ?? controller.preview?.snapshot.selection
  const start = () => {
    if (reason) return
    const captured = structuredClone(settings.value)
    setDismissed(''); setCompareOriginal(true); setPreviewSettings(captured)
    void controller.start(mode, captured)
  }
  return <div className="dsh-prompt-enhance" data-prompt-enhance="true">
    <Button variant="ghost" size="sm" type="button" className="dsh-prompt-enhance-trigger"
        aria-label={pending ? t("m016") : canUndo ? t("m017") : t("m018")} aria-busy={pending}
        aria-disabled={!pending && !canUndo && !!reason}
        title={pending ? t("m019") : canUndo ? t("m017") : diagnostic(reason) || t("m020", { p0: labels[mode] })}
        onClick={() => {
          setDismissed('')
          if (pending) controller.cancel()
          else if (canUndo) controller.restore()
          else start()
        }}><EnhanceIcon pending={pending} restore={canUndo} /></Button>
    <span className="dsh-prompt-enhance-sr" role="status" aria-live="polite">{pending ? t("m021") : diagnostic(controller.message)}</span>
    {controller.message && dismissed !== controller.message && <Toast key={controller.message}
      text={diagnostic(controller.message)} holdMs={4500} onDone={() => setDismissed(controller.message)} />}
    <Modal open={!!controller.preview} onClose={() => controller.closePreview()} title={t("m022")} closeLabel={t("m023")}
      description={`${labels[previewSettings.mode]} · ${contextLabels[previewSettings.context]}`}
      className="dsh-prompt-enhance-dialog" contentClassName="dsh-prompt-enhance-dialog-body" footer={<>
        <Button variant="ghost" onClick={() => controller.closePreview()}>{t("m024")}</Button>
        <Button variant="primary" disabled={controller.checkingPreview} onClick={() => { setDismissed(''); void controller.acceptPreview() }}>{controller.checkingPreview ? t("m025") : t("m026")}</Button>
      </>}>
      {controller.preview && <>
        <div className="dsh-prompt-enhance-preview-toolbar">
          <p className="dsh-prompt-enhance-meta">{selection?.model}{selection?.reasoningEffort && ` · ${selection.reasoningEffort}`} · {previewSettings.modelStrategy === 'follow' ? t("m027") : t("m028")}
            {controller.preview.snapshot.attachmentIds.length > 0 && t("m029", { p0: controller.preview.snapshot.attachmentIds.length })}</p>
          <label className="dsh-prompt-enhance-compare-toggle"><input type="checkbox" checked={compareOriginal} onChange={event => setCompareOriginal(event.target.checked)} />{t("m030")}</label>
        </div>
        <div className={`dsh-prompt-enhance-comparison${compareOriginal ? '' : ' dsh-prompt-enhance-comparison-solo'}`}>
          {compareOriginal && <section className="dsh-prompt-enhance-original"><h3>{t("m031")}</h3><pre className="dsh-prompt-enhance-text">{controller.preview.snapshot.draft.text}</pre></section>}
          <section><h3>{t("m032")}</h3><pre className="dsh-prompt-enhance-text">{controller.preview.draft.text}</pre></section>
        </div>
        {controller.preview.response.context?.warnings.map((warning, index) => <p className="dsh-prompt-enhance-warning" key={warning} role="status">{localize(warning, controller.preview!.response.context?.warningMessages?.[index] ?? undefined)}</p>)}
        <details className="dsh-prompt-enhance-sources"><summary>{t("m033")}{controller.preview.response.context?.sources.length ?? 0}{t("m034")}</summary>
          {controller.preview.response.context?.sources.map((source, index) => <section className="dsh-prompt-enhance-source" key={index}><h4>{sourceLabel(source)}</h4><pre className="dsh-prompt-enhance-text">{source.text}</pre></section>)}
          {!controller.preview.response.context?.sources.length && <p>{t("m035")}</p>}
        </details>
      </>}
    </Modal>
  </div>
}

function createBinding(ctx: Context, sessionId: SessionId, settings: SettingsClient): ViewBinding {
  const session = ctx.sessions.binding(sessionId)!
  const input = ctx.conversation.input.for(session.ctx)
  const directory = ctx.modelDirectories.directoryFor(sessionId)
  const blocks = ctx.conversation.blocks.storeFor(sessionId)
  void directory.load().catch(() => {})

  const reason = (): string => {
    const state = input.state.getSnapshot()
    const models = directory.store.getSnapshot()
    const snapshot = session.session.getSnapshot()
    if (ctx.sessions.binding(sessionId) !== session || snapshot.removed || snapshot.openState !== 'open') return t("m036")
    if (snapshot.subagent !== null) return t("m037")
    if (state.claim || state.phase === 'claimed' || /^\s*\/\S/u.test(state.draft)) return t("m038")
    if (state.phase !== 'plain' || blocks.getSnapshot() || ctx.uiSession.sessionStatus.getSnapshot().get(sessionId)?.pendingInteraction) return t("m039")
    if (!state.draft.trim()) return t("m040")
    if (state.draft.length > DRAFT_CHAR_LIMIT) return t("m041", { p0: DRAFT_CHAR_LIMIT.toLocaleString() })
    if (!settings.ready) return settings.error || m("m042")
    if (settings.value.modelStrategy === 'dedicated') {
      const selected = settings.value.dedicated
      if (!selected || !settings.capabilities.models.some(model => model.provider === selected.provider && model.model === selected.model && (!selected.reasoningEffort || model.efforts.includes(selected.reasoningEffort)))) return t("m043")
    } else if (models.status !== 'ready' || !models.routable || !models.current) return t("m044")
    return ''
  }

  return {
    reason,
    read: () => {
      const state = input.state.getSnapshot()
      const current = directory.store.getSnapshot().current
      return {
        sessionId, revision: state.draftRev,
        draft: { text: state.draft, references: state.occurrences.map(({ occurrenceId: _id, ...reference }) => ({ ...reference })) },
        attachmentIds: [...state.attachmentIds], selection: settings.value.modelStrategy === 'dedicated' ? settings.value.dedicated : current,
        current: current ?? null,
        available: reason() === '',
      }
    },
    write: draft => {
      // DSH 0.2.1-rc.3 accepts DraftInput here at runtime, although the
      // public SessionInput declaration still advertises only string.
      // Keep this version-specific adaptation in one place and verify it in DSH.
      const writeSemantic = input.setDraft.bind(input) as (value: DraftInput) => void
      writeSemantic(draft as DraftInput)
    },
    enhance: async (request, signal) => {
      const result = await ctx.remote.promptEnhance.enhance(request, signal)
      if (!result.ok) throw new Error(result.error.message)
      return result.value
    },
    validateSelection: async (selection, signal) => {
      const capabilities = await ctx.remote.promptEnhance.capabilities(signal)
      if (!capabilities.ok) throw new Error(capabilities.error.message)
      if (!capabilities.value.owner) {
        await directory.load()
        return directory.store.getSnapshot().routable === true
      }
      return capabilities.value.models.some(model => model.provider === selection.provider && model.model === selection.model && (!selection.reasoningEffort || model.efforts.includes(selection.reasoningEffort)))
    },
    subscribe: listener => {
      const dispose = [input.state.subscribe(listener), directory.store.subscribe(listener),
        session.session.subscribe(listener), blocks.subscribe(listener), ctx.uiSession.sessionStatus.subscribe(listener)]
      return () => { for (const stop of dispose) stop() }
    },
  }
}

export const inject = ['locale', 'remote', 'slots', 'sessions', 'conversation', 'modelDirectories', 'uiSession']

/** Mount the generated Remote contribution and the native composer slot together. */
export async function apply(ctx: Context): Promise<() => Promise<void>> {
  const unmountRemote = await ctx.remote.$mount(TYPERT_REMOTE)
  const ui = ctx.inject(['locale', 'remote.promptEnhance', 'remote.session', 'slots', 'sessions', 'conversation', 'modelDirectories', 'uiSession'], scope => {
    installLocale(scope)
    const settings = new SettingsClient(scope)
    scope.effect(() => () => settings.dispose())
    const style = document.createElement('style')
    style.dataset.dshPlugin = 'dsh-prompt-improver'
    style.textContent = styles
    document.head.append(style)
    scope.effect(() => () => style.remove())
    scope.slots.inject('conversation.input.right', () => scope.slots.register({
      name: 'conversation.input.right', id: 'dsh-prompt-improver', order: 100,
      inject: sessionId => ({ binding: createBinding(scope, sessionId, settings), settings }),
    }, EnhanceButton))
    scope.slots.inject('settings.section', () => scope.slots.register({
      name: 'settings.section', id: 'dsh-prompt-improver', order: 45, label: () => t("m045"),
      inject: () => ({ settings }),
    }, EnhanceSettingsPage))
    scope.slots.inject('conversation.input.overlay', () => scope.slots.register({
      name: 'conversation.input.overlay', id: 'dsh-prompt-improver', order: 100,
      inject: sessionId => ({ ctx: scope, sessionId, settings }),
    }, PredictionOverlay))
  })
  try { await ui }
  catch (error) { await ui.dispose(); await unmountRemote(); throw error }
  return async () => { await ui.dispose(); await unmountRemote() }
}
