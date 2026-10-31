import { m } from '../shared/messages.js'
import { protectReferences, restoreReferences } from '../shared/references.js'
import type { SemanticDraft } from '../shared/references.js'
import { sameSelection } from '../shared/types.js'
import type { EnhanceMode, EnhanceRequest, EnhanceResponse, EnhanceSettings, ModelSelection } from '../shared/types.js'

export interface ComposerSnapshot {
  sessionId: string
  revision: number
  draft: SemanticDraft
  attachmentIds: readonly string[]
  selection: ModelSelection | null
  /** Composer model; the mystery injection is gated on it, not on `selection`. */
  current: ModelSelection | null
  available: boolean
}

export interface ControllerPort {
  read(): ComposerSnapshot
  write(draft: SemanticDraft): void
  enhance(request: EnhanceRequest, signal: AbortSignal): Promise<EnhanceResponse>
  changed(): void
  nonce(): string
  validateSelection?(selection: ModelSelection, signal: AbortSignal): Promise<boolean>
}

interface ActiveRequest { abort: AbortController; snapshot: ComposerSnapshot }
interface Undo { original: SemanticDraft; applied: ComposerSnapshot }
export interface Preview { snapshot: ComposerSnapshot; draft: SemanticDraft; response: EnhanceResponse }

function sameComposer(a: ComposerSnapshot, b: ComposerSnapshot): boolean {
  return a.sessionId === b.sessionId && a.revision === b.revision &&
    JSON.stringify(a.draft) === JSON.stringify(b.draft) &&
    sameSelection(a.selection, b.selection) && sameSelection(a.current, b.current) && a.available === b.available &&
    a.attachmentIds.length === b.attachmentIds.length &&
    a.attachmentIds.every((id, i) => id === b.attachmentIds[i])
}

/** Owns asynchronous requests independently of React render timing. */
export class EnhanceController {
  private active?: ActiveRequest
  private undo?: Undo
  private disposed = false
  preview?: Preview
  private applying?: AbortController
  message = ''
  constructor(private readonly port: ControllerPort) {}

  get pending(): boolean { return this.active !== undefined }
  get checkingPreview(): boolean { return this.applying !== undefined }
  get canUndo(): boolean {
    return !this.pending && !!this.undo && sameComposer(this.port.read(), this.undo.applied)
  }

  reconcile(): void {
    if (this.disposed) return
    const snapshot = this.port.read()
    if (this.active && !sameComposer(snapshot, this.active.snapshot)) {
      this.cancel(m("m000"))
    }
    if (this.undo && !sameComposer(snapshot, this.undo.applied)) {
      this.undo = undefined
      this.port.changed()
    }
    if (this.preview && !sameComposer(snapshot, this.preview.snapshot)) {
      this.closePreview()
      this.message = m("m001")
      this.port.changed()
    }
  }

  cancel(message = m("m002")): void {
    const active = this.active
    if (!active) return
    this.active = undefined
    active.abort.abort()
    this.message = message
    if (!this.disposed) this.port.changed()
  }

  async start(mode: EnhanceMode, settings?: EnhanceSettings, previewOnce = false): Promise<void> {
    if (this.disposed || this.active) return
    const snapshot = structuredClone(this.port.read())
    if (!snapshot.available || !snapshot.selection || !snapshot.draft.text.trim()) return
    const active: ActiveRequest = { abort: new AbortController(), snapshot }
    this.active = active
    this.closePreview()
    this.message = ''
    this.port.changed()
    try {
      const protectedDraft = protectReferences(snapshot.draft, this.port.nonce())
      const result = await this.port.enhance({
        sessionId: snapshot.sessionId,
        draft: protectedDraft.text,
        protectedTokens: protectedDraft.tokens,
        mode,
        selection: { ...snapshot.selection },
        currentSelection: snapshot.current ? { ...snapshot.current } : null,
        ...(settings ? { settings: structuredClone(settings) } : {}),
      }, active.abort.signal)
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return
      if (!sameComposer(this.port.read(), snapshot)) {
        this.cancel(m("m003"))
        return
      }
      if (!result.text.trim()) throw new Error(m("m004"))
      const next = restoreReferences(result.text.trim(), protectedDraft)
      // setDraft is synchronous in the supported DSH version. Retire the
      // request before writing: synchronous store subscribers may reconcile.
      this.active = undefined
      if (previewOnce || settings?.adoption === 'preview') {
        this.preview = { snapshot, draft: next, response: result }
        this.message = ''
      } else this.apply(next, snapshot, result)
    } catch (error) {
      if (this.disposed || this.active !== active || active.abort.signal.aborted) return
      this.message = error instanceof Error ? error.message : m("m005")
    } finally {
      if (this.active === active) this.active = undefined
      if (!this.disposed) this.port.changed()
    }
  }

  private apply(draft: SemanticDraft, snapshot: ComposerSnapshot, response: EnhanceResponse): void {
    this.port.write(draft)
    this.undo = { original: snapshot.draft, applied: structuredClone(this.port.read()) }
    this.message = [m("m006"), ...(response.context?.warnings ?? [])].join(' ')
  }

  async acceptPreview(): Promise<void> {
    const preview = this.preview
    if (!preview || this.applying || this.disposed) return
    const abort = new AbortController(); this.applying = abort
    this.port.changed()
    try {
      if (this.port.validateSelection && !await this.port.validateSelection(preview.snapshot.selection!, AbortSignal.any([abort.signal, AbortSignal.timeout(15000)]))) {
        throw new Error(m("m007"))
      }
      if (this.disposed || abort.signal.aborted || this.preview !== preview) return
      if (!sameComposer(this.port.read(), preview.snapshot)) throw new Error(m("m008"))
      this.preview = undefined
      this.apply(preview.draft, preview.snapshot, preview.response)
    } catch (error) {
      if (!this.disposed && !abort.signal.aborted) {
        this.preview = undefined
        this.message = error instanceof Error ? error.message : m("m009")
      }
    } finally { if (this.applying === abort) this.applying = undefined; if (!this.disposed) this.port.changed() }
  }

  closePreview(): void {
    this.preview = undefined
    this.applying?.abort(); this.applying = undefined
    if (!this.disposed) this.port.changed()
  }

  restore(): void {
    if (!this.canUndo) return
    const original = this.undo!.original
    this.undo = undefined
    this.port.write(structuredClone(original))
    this.message = m("m010")
    this.port.changed()
  }

  dispose(): void {
    this.disposed = true
    this.cancel()
    this.closePreview()
    this.undo = undefined
  }
}
