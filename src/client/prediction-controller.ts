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
export interface PredictionPort {
  read(): PredictionSnapshot
  predict(request: PredictionRequest, signal: AbortSignal): Promise<PredictionResponse>
  insert(text: string): boolean
  changed(): void
  now?(): number
}

/** Presentation never writes a draft; only accept() can call insert. */
export class PredictionController {
  suggestion = ''
  message = ''
  private key = ''
  private readonly attempted = new Set<string>()
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
    if (this.active || this.timer || this.suggestion || this.attempted.has(state.dedupeKey ?? state.key)) return
    const delay = Math.max(PREDICTION_DEBOUNCE_MS, PREDICTION_INTERVAL_MS - (this.now() - this.lastStart))
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
      this.suggestion = result.text.trim() ? result.text : ''
      this.message = result.context?.warnings.join(' ') ?? ''
    } catch (error) {
      if (!this.disposed && this.active === active && !active.abort.signal.aborted) this.message = error instanceof Error ? error.message : m("m048")
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
    this.stop(); this.suggestion = ''; this.message = ''
    const inserted = this.port.insert(text)
    // A synchronous editor subscriber may already have scheduled a new request.
    this.stop(); const applied = this.port.read(); this.key = applied.key; this.remember(applied)
    this.port.changed()
    return inserted
  }
  dismiss(): void { this.stop(); this.remember(this.port.read()); this.suggestion = ''; this.message = ''; this.port.changed() }
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
