import { subscribeLocale, t, localize } from './i18n.js'
import { useEffect, useRef } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { InputActions } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { SettingsClient } from './settings.js'
import { PredictionController } from './prediction-controller.js'
import { protectReferences } from '../shared/references.js'
import { DRAFT_CHAR_LIMIT } from '../shared/types.js'

/** Compare DOM boundaries, not text offsets: reference chips have a separate detect projection. */
export function caretAtEnd(editor: HTMLElement): boolean {
  const selection = editor.ownerDocument.getSelection()
  if (!selection?.isCollapsed || !selection.rangeCount || !selection.anchorNode || !editor.contains(selection.anchorNode)) return false
  const anchorElement = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode.parentElement
  const paragraph = anchorElement?.closest('p')
  if (paragraph && paragraph !== editor.lastElementChild) return false
  if (selection.anchorNode === editor && selection.anchorOffset !== editor.childNodes.length) return false
  const tail = selection.getRangeAt(0).cloneRange()
  tail.selectNodeContents(editor)
  tail.setStart(selection.anchorNode, selection.anchorOffset)
  const rest = tail.cloneContents()
  // Lexical's final empty-line BR has no semantic text.
  return !rest.textContent && !rest.querySelector('[data-lexical-decorator], [contenteditable="false"]')
}

/** Scoped adapter for the rc.3 resident input DOM. Never changes Lexical's document. */
export function mountPredictionView(editor: HTMLElement, badge: HTMLElement) {
  const grow = editor.parentElement!
  const oldHeight = grow.style.minHeight
  const mirror = document.createElement('div')
  mirror.className = 'dsh-prediction-mirror'
  mirror.setAttribute('aria-hidden', 'true'); mirror.inert = true
  grow.append(mirror)
  const clear = () => {
    mirror.replaceChildren(); mirror.hidden = true; grow.style.minHeight = oldHeight
    editor.removeAttribute('data-prediction-visible'); badge.textContent = ''
  }
  return {
    show(text: string, message: string) {
      message = localize(message)
      clear()
      badge.textContent = text ? t("m049", { p0: message ? ` · ${message}` : '' }) : message
      badge.title = message
      if (!text) return
      const copy = editor.cloneNode(true) as HTMLElement
      copy.removeAttribute('data-composer-input'); copy.removeAttribute('id')
      copy.removeAttribute('role'); copy.removeAttribute('tabindex'); copy.removeAttribute('aria-label')
      copy.contentEditable = 'false'; copy.removeAttribute('data-prediction-visible')
      for (const child of copy.querySelectorAll('[id], [tabindex]')) { child.removeAttribute('id'); child.removeAttribute('tabindex') }
      const paragraph = copy.querySelector('p:last-child') ?? copy
      if (paragraph.childNodes.length === 1 && paragraph.firstChild?.nodeName === 'BR') paragraph.replaceChildren()
      const suffix = document.createElement('span')
      suffix.className = 'dsh-prediction-suffix'; suffix.textContent = text; paragraph.append(suffix)
      mirror.hidden = false; mirror.append(copy)
      grow.style.minHeight = `${Math.max(editor.offsetHeight, mirror.scrollHeight)}px`
      editor.setAttribute('data-prediction-visible', '')
    },
    dispose() { clear(); mirror.remove() },
  }
}

export function PredictionOverlay({ ctx, sessionId, settings, inputActions }: {
  ctx: Context; sessionId: SessionId; settings: SettingsClient; inputActions: InputActions;
}) {
  const marker = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const badge = marker.current
    const card = badge?.closest('[data-composer-card]')
    const editor = card?.querySelector<HTMLElement>('[data-composer-input]')
    const session = ctx.sessions.binding(sessionId)
    if (!badge || !card || !editor || !session || !inputActions) return
    const input = ctx.conversation.input.for(session.ctx)
    const directory = ctx.modelDirectories.directoryFor(sessionId)
    const blocks = ctx.conversation.blocks.storeFor(sessionId)
    const nonce = crypto.randomUUID()
    let composing = false, compositionUntil = 0, disposed = false
    const view = mountPredictionView(editor, badge)
    const read = () => {
      const state = input.state.getSnapshot(), snapshot = session.session.getSnapshot()
      const models = directory.store.getSnapshot(), events = session.eventSource.getSnapshot()
      const selection = settings.value.modelStrategy === 'dedicated' ? settings.value.dedicated : models.current
      const status = ctx.uiSession.sessionStatus.getSnapshot().get(sessionId)
      const hasHistory = events.entries.some(entry => entry.type === 'event' && entry.event.type === 'turn/end' && entry.event.data.reason.kind === 'completed')
      const eligible = settings.ready && settings.capabilities.owner && settings.value.predictionEnabled && !settings.enhancing.has(sessionId) &&
        ctx.sessions.binding(sessionId) === session && snapshot.openState === 'open' && !snapshot.removed && snapshot.subagent === null &&
        !sessionId.startsWith('im:') && !snapshot.running && !status?.running && !status?.pendingInteraction && !snapshot.pendingSubmissions.length &&
        state.phase === 'plain' && !state.claim && !state.queue?.length && !blocks.getSnapshot() && !/^\s*\//u.test(state.draft) &&
        state.draft.length <= DRAFT_CHAR_LIMIT && (!!state.draft.trim() || hasHistory) &&
        !!selection && (settings.value.modelStrategy === 'dedicated' ? settings.capabilities.models.some(model => model.provider === selection.provider && model.model === selection.model && (!selection.reasoningEffort || model.efforts.includes(selection.reasoningEffort))) : models.status === 'ready' && models.routable) &&
        document.visibilityState === 'visible' && document.activeElement === editor && editor.isContentEditable && editor.getBoundingClientRect().width > 0 &&
        !composing && Date.now() >= compositionUntil && !editor.hasAttribute('data-composer-composing') && !card.querySelector('[data-trigger-menu]') &&
        caretAtEnd(editor)
      const dedupeKey = JSON.stringify([sessionId, state.draft, state.occurrences, state.attachmentIds, selection, models.current, settings.value, events.revision])
      const key = JSON.stringify([state.draftRev, dedupeKey])
      let request = null
      if (eligible && selection) {
        try {
          const protectedDraft = protectReferences({ text: state.draft, references: state.occurrences.map(({ occurrenceId: _id, ...ref }) => ref) }, nonce)
          request = { sessionId, draft: protectedDraft.text, protectedTokens: protectedDraft.tokens, selection, settings: settings.value }
        } catch { /* A changing reference is temporarily ineligible. */ }
      }
      return { key, dedupeKey, eligible: !!eligible && !!request, request }
    }
    const controller = new PredictionController({ read, changed: () => { if (!disposed) view.show(controller.suggestion, controller.message) },
      predict: async (request, signal) => {
        const result = await ctx.remote.promptEnhance.predict(request, signal)
        if (!result.ok) throw new Error(result.error.message)
        return result.value
      },
      insert: text => {
        // rc.3 clears its history after submission. Seed an empty native edit first,
        // so the first accepted message has an empty checkpoint for one-step undo.
        // This runs only on explicit acceptance and never inserts placeholder text.
        const draft = input.state.getSnapshot()
        if (draft.draft === '' && !draft.occurrences.length && !inputActions.insertText('', inputActions.captureInsertion())) return false
        return inputActions.insertText(text, inputActions.captureInsertion())
      },
    })
    const reconcile = () => { if (!disposed) controller.reconcile() }
    const onCompositionStart = () => { composing = true; reconcile() }
    const onCompositionEnd = () => { composing = false; compositionUntil = Date.now() + 20; reconcile(); setTimeout(reconcile, 25) }
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || composing || Date.now() < compositionUntil || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return
      if (event.key === 'Tab' && controller.suggestion && read().eligible && controller.accept()) { event.preventDefault(); event.stopImmediatePropagation() }
      else if (event.key === 'Escape' && (controller.suggestion || controller.pending)) { controller.dismiss(); event.preventDefault(); event.stopImmediatePropagation() }
    }
    editor.addEventListener('keydown', onKey, true)
    editor.addEventListener('compositionstart', onCompositionStart)
    editor.addEventListener('compositionend', onCompositionEnd)
    editor.addEventListener('focus', reconcile); editor.addEventListener('blur', reconcile)
    document.addEventListener('selectionchange', reconcile); document.addEventListener('visibilitychange', reconcile)
    const mutation = new MutationObserver(records => {
      // Ignore presentation writes, including the height reserved for wrapped ghost text.
      if (records.some(record => record.target instanceof Element && !record.target.closest('.dsh-prediction-mirror, .dsh-prediction-badge') &&
        !(record.type === 'attributes' && (record.attributeName === 'data-prediction-visible' || record.target === editor.parentElement)))) reconcile()
    })
    mutation.observe(card, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['data-composer-composing', 'contenteditable', 'hidden'] })
    const stopLocale = subscribeLocale(() => view.show(controller.suggestion, controller.message))
    const resize = new ResizeObserver(() => view.show(controller.suggestion, controller.message)); resize.observe(editor)
    const stops = [settings.subscribe(reconcile), input.state.subscribe(reconcile), directory.store.subscribe(reconcile), session.session.subscribe(reconcile), session.eventSource.subscribe(reconcile), blocks.subscribe(reconcile), ctx.uiSession.sessionStatus.subscribe(reconcile)]
    void directory.load().then(reconcile).catch(() => {}); void settings.load().then(reconcile)
    reconcile()
    return () => {
      disposed = true; controller.dispose(); mutation.disconnect(); stopLocale(); resize.disconnect(); stops.forEach(stop => stop())
      editor.removeEventListener('keydown', onKey, true); editor.removeEventListener('compositionstart', onCompositionStart); editor.removeEventListener('compositionend', onCompositionEnd)
      editor.removeEventListener('focus', reconcile); editor.removeEventListener('blur', reconcile)
      document.removeEventListener('selectionchange', reconcile); document.removeEventListener('visibilitychange', reconcile)
      view.dispose()
    }
  }, [ctx, sessionId, settings, inputActions])
  return <div ref={marker} className="dsh-prediction-badge" role="status" aria-live="polite" />
}
