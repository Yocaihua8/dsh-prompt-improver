import { m } from '../shared/messages.js'
import { PREDICTION_CHAR_LIMIT, PREDICTION_DEBOUNCE_MS, PREDICTION_INTERVAL_MS, PREDICTION_TIMEOUT_MS } from '../shared/types.js'
import type { PredictionRequest, PredictionResponse } from '../shared/types.js'

export interface PredictionSnapshot {
  /** Includes session generation, draft revision, references, attachments, model, settings, and context. */
  key: string
  /** Semantic identity omits the monotonic revision, so undo does not repeat a dismissed suggestion. */
  dedupeKey?: string
  eligible: boolean
  request: PredictionRequest | null
}

/** Cap for repeated empty/failed predictions; grows from PREDICTION_INTERVAL_MS by doubling. */
const PREDICTION_BACKOFF_CAP_MS = 30_000
export interface PredictionPort {
  read(): PredictionSnapshot
  predict(request: PredictionRequest, signal: AbortSignal): Promise<PredictionResponse>
  insert(text: string): boolean
  changed(): void
  now?(): number
}

/** Split a suggestion into the first segmented word (with trailing spaces) and the remainder. */
export function splitSuggestionHead(suggestion: string): { head: string; rest: string } {
  const segments = [...new Intl.Segmenter(undefined, { granularity: 'word' }).segment(suggestion)]
  let index = 0
  while (index < segments.length && !segments[index]!.isWordLike) index++
  if (index >= segments.length) {
    const first = segments[0]?.segment ?? ''
    return first && first.length < suggestion.length ? { head: first, rest: suggestion.slice(first.length) } : { head: suggestion, rest: '' }
  }
  // Exactly one segmented word: CJK has no separators, so a "run" would swallow the clause.
  let end = index + 1
  while (end < segments.length && /^\s+$/u.test(segments[end]!.segment)) end++
  const cut = end < segments.length ? segments[end]!.index : suggestion.length
  return { head: suggestion.slice(0, cut), rest: suggestion.slice(cut) }
}

/** Presentation never writes a draft; only accept()/acceptWord() can call insert. */
export class PredictionController {
  suggestion = ''
  message = ''
  private key = ''
  private readonly attempted = new Set<string>()
  // Suggestions already shown for a semantic snapshot; restorable after incidental edits until accepted or dismissed.
  private readonly shown = new Map<string, { text: string; message: string }>()
  private backoff = 0
  private timer?: ReturnType<typeof setTimeout>
  private active?: { key: string; abort: AbortController }
  private lastStart = -Infinity
  private disposed = false
  constructor(private readonly port: PredictionPort) {}
  get pending(): boolean { return !!this.active }
  private now(): number { return this.port.now?.() ?? Date.now() }
  reconcile(): void {
    if (this.disposed) return
    const state = this.port.read()
    if (state.key !== this.key) {
      this.stop(); this.key = state.key; this.suggestion = ''; this.message = ''; this.port.changed()
    }
    if (!state.eligible || !state.request) {
      this.stop(); this.suggestion = ''; this.message = ''; this.port.changed(); return
    }
    const identity = state.dedupeKey ?? state.key
    if (!this.suggestion) {
      // Incidental edits returning to the same semantic draft restore the shown suggestion immediately.
      const shown = this.shown.get(identity)
      if (shown) { this.suggestion = shown.text; this.message = shown.message; this.port.changed() }
    }
    if (this.active || this.timer || this.suggestion || this.attempted.has(identity)) return
    const delay = Math.max(PREDICTION_DEBOUNCE_MS, this.backoff, PREDICTION_INTERVAL_MS - (this.now() - this.lastStart))
    this.timer = setTimeout(() => { this.timer = undefined; void this.start() }, delay)
  }
  private async start(): Promise<void> {
    const state = this.port.read()
    if (this.disposed || !state.eligible || !state.request || state.key !== this.key || this.attempted.has(state.dedupeKey ?? state.key)) return
    this.remember(state); this.lastStart = this.now()
    const active = { key: state.key, abort: new AbortController() }; this.active = active
    this.port.changed()
    const timeout = setTimeout(() => { if (this.active === active) { this.stop(); this.message = m("m046"); this.port.changed() } }, PREDICTION_TIMEOUT_MS)
    try {
      const result = await this.port.predict(structuredClone(state.request), active.abort.signal)
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return
      const current = this.port.read()
      if (!current.eligible || current.key !== state.key) return
      if (Array.from(result.text).length > PREDICTION_CHAR_LIMIT || /⟦DSH_REF_/u.test(result.text)) throw new Error(m("m047"))
      const text = result.text.trim() ? result.text : ''
      this.message = result.context?.warnings.join(' ') ?? ''
      // An empty suffix is the model declining; back off so the next pause does not re-predict at once.
      if (text) {
        this.rememberShown(state.dedupeKey ?? state.key, text, this.message)
        this.backoff = 0
      } else {
        this.backoff = Math.min(Math.max(this.backoff * 2, PREDICTION_INTERVAL_MS), PREDICTION_BACKOFF_CAP_MS)
      }
      this.suggestion = text
    } catch (error) {
      if (!this.disposed && this.active === active && !active.abort.signal.aborted) {
        this.backoff = Math.min(Math.max(this.backoff * 2, PREDICTION_INTERVAL_MS), PREDICTION_BACKOFF_CAP_MS)
        this.message = error instanceof Error ? error.message : m("m048")
      }
    } finally {
      clearTimeout(timeout)
      if (this.active === active) this.active = undefined
      if (!this.disposed) this.port.changed()
    }
  }
  accept(): boolean {
    const state = this.port.read()
    if (!this.suggestion || !state.eligible || state.key !== this.key) { this.reconcile(); return false }
    const text = this.suggestion
    this.shown.delete(state.dedupeKey ?? state.key)
    this.stop(); this.suggestion = ''; this.message = ''
    const inserted = this.port.insert(text)
    // A synchronous editor subscriber may already have scheduled a new request.
    this.stop(); const applied = this.port.read(); this.key = applied.key; this.remember(applied)
    this.port.changed()
    return inserted
  }

  /** Tab-equivalent for the remaining suggestion after acceptWord kept it visible. */
  acceptWord(): boolean {
    const state = this.port.read()
    if (!this.suggestion || !state.eligible || state.key !== this.key) { this.reconcile(); return false }
    const { head, rest } = splitSuggestionHead(this.suggestion)
    if (!head) return false
    if (!rest) return this.accept()
    this.stop(); this.suggestion = ''; this.message = ''
    const inserted = this.port.insert(head)
    const applied = this.port.read()
    this.key = applied.key
    if (inserted && applied.eligible && applied.request) {
      // Keep the remainder visible for the freshly updated draft; block an instant re-predict.
      this.suggestion = rest
      this.rememberShown(applied.dedupeKey ?? applied.key, rest, '')
      this.remember(applied)
    }
    this.port.changed()
    return inserted
  }

  /** Alt+\: force one prediction for the current snapshot, bypassing the content dedupe and the backoff once. */
  manualTrigger(): void {
    if (this.disposed || this.active || this.suggestion) return
    const state = this.port.read()
    if (!state.eligible || !state.request) return
    this.attempted.delete(state.dedupeKey ?? state.key)
    this.key = state.key
    if (this.timer) { clearTimeout(this.timer); this.timer = undefined }
    const delay = Math.max(0, PREDICTION_INTERVAL_MS - (this.now() - this.lastStart))
    if (delay > 0) this.timer = setTimeout(() => { this.timer = undefined; void this.start() }, delay)
    else void this.start()
  }
  dismiss(): void {
    const state = this.port.read()
    this.stop(); this.remember(state); this.shown.delete(state.dedupeKey ?? state.key)
    this.suggestion = ''; this.message = ''; this.port.changed()
  }
  private rememberShown(id: string, text: string, message: string): void {
    this.shown.delete(id); this.shown.set(id, { text, message })
    if (this.shown.size > 32) this.shown.delete(this.shown.keys().next().value!)
  }
  private remember(state: PredictionSnapshot): void {
    this.attempted.add(state.dedupeKey ?? state.key)
    if (this.attempted.size > 32) this.attempted.delete(this.attempted.values().next().value!)
  }
  private stop(): void {
    if (this.timer) clearTimeout(this.timer)
    this.timer = undefined
    const active = this.active; this.active = undefined; active?.abort.abort()
  }
  dispose(): void { this.disposed = true; this.stop(); this.suggestion = ''; this.message = '' }
}
