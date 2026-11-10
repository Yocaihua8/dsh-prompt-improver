import test from 'node:test'
import assert from 'node:assert/strict'
import { PredictionController, splitSuggestionHead, type PredictionSnapshot } from '../src/client/prediction-controller.js'
import { DEFAULT_SETTINGS, type PredictionResponse } from '../src/shared/types.js'
const flush = async () => { await Promise.resolve(); await Promise.resolve() }
test('splitSuggestionHead takes one segmented word and always rebuilds the suggestion', () => {
  const english = splitSuggestionHead(' how a rainbow forms.')
  assert.equal(english.head, ' how '); assert.equal(english.rest, 'a rainbow forms.')
  for (const suggestion of ['，请举一个例子。', '的形成过程，尽量少用专业术语。', 'next word', '。', '']) {
    const { head, rest } = splitSuggestionHead(suggestion)
    assert.equal(head + rest, suggestion)
    if (suggestion.length > 1) { assert.ok(head.length > 0); assert.ok(head.length < suggestion.length || rest === '') }
    if (rest) assert.ok(suggestion.endsWith(rest))
  }
})
function fixture() {
  const state: PredictionSnapshot = { key: 'a', eligible: true, request: { sessionId: 's', draft: '', protectedTokens: [], selection: { provider: 'p', model: 'm' }, settings: { ...DEFAULT_SETTINGS, predictionEnabled: true } } }
  const requests: { signal: AbortSignal; resolve: (value: PredictionResponse) => void; reject: (error: Error) => void }[] = []
  const writes: string[] = []
  const controller = new PredictionController({ read: () => state, changed() {},
    predict: (_request, signal) => new Promise((resolve, reject) => requests.push({ signal, resolve, reject })),
    insert(text) { writes.push(text); state.key += '-accepted'; controller.reconcile(); return true },
  })
  return { state, controller, requests, writes }
}
test('800ms debounce, interval throttle, only latest snapshot may show; no implicit writes', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(799); assert.equal(f.requests.length, 0)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 1)
  f.state.key = 'b'; f.controller.reconcile(); assert.ok(f.requests[0]!.signal.aborted)
  f.requests[0]!.resolve({ text: 'stale' }); await flush(); assert.equal(f.controller.suggestion, '')
  t.mock.timers.tick(2999); assert.equal(f.requests.length, 1)
  t.mock.timers.tick(5001); assert.equal(f.requests.length, 2)
  f.requests[1]!.resolve({ text: '现在的建议' }); await flush()
  assert.equal(f.controller.suggestion, '现在的建议'); assert.deepEqual(f.writes, [])
  assert.ok(f.controller.accept()); assert.deepEqual(f.writes, ['现在的建议'])
  t.mock.timers.tick(5000); assert.equal(f.requests.length, 2)
})
test('Esc and failures suppress same snapshot retries; setting change permits a new request', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800); f.controller.dismiss()
  f.requests[0]!.resolve({ text: 'ignored' }); await flush()
  f.controller.reconcile(); t.mock.timers.tick(5000); assert.equal(f.requests.length, 1)
  f.state.key = 'settings'; f.controller.reconcile(); t.mock.timers.tick(3000)
  f.requests[1]!.reject(new Error('failed')); await flush()
  f.controller.reconcile(); t.mock.timers.tick(5000); assert.equal(f.requests.length, 2)
  assert.equal(f.controller.message, 'failed')
})
test('ineligible, unfocused, changed selection or disabled input cancels and cannot accept', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.state.eligible = false; f.controller.reconcile(); assert.ok(f.requests[0]!.signal.aborted)
  f.requests[0]!.resolve({ text: 'ignored' }); await flush(); assert.equal(f.controller.accept(), false)
  assert.deepEqual(f.writes, []); assert.equal(f.controller.suggestion, '')
})
test('client deadline terminates a transport that ignores AbortSignal', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800); t.mock.timers.tick(30000)
  assert.ok(f.requests[0]!.signal.aborted); assert.equal(f.controller.pending, false)
  assert.match(f.controller.message, /超时/)
  f.requests[0]!.resolve({ text: 'late' }); await flush(); assert.equal(f.controller.suggestion, '')
})
test('undoing to the same semantic draft does not repeat an accepted prediction', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.state.dedupeKey = 'original'; f.controller.reconcile(); t.mock.timers.tick(800)
  f.requests[0]!.resolve({ text: 'next' }); await flush(); f.controller.accept()
  f.state.key = 'undo-revision'; f.controller.reconcile(); t.mock.timers.tick(5000)
  assert.equal(f.requests.length, 1); assert.equal(f.controller.suggestion, '')
})
test('acceptWord inserts the first word chunk and keeps the remainder visible for Tab', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.requests[0]!.resolve({ text: ' how a rainbow forms.' }); await flush()
  assert.ok(f.controller.acceptWord())
  assert.deepEqual(f.writes, [' how '])
  assert.equal(f.controller.suggestion, 'a rainbow forms.')
  assert.ok(f.controller.accept()); assert.deepEqual(f.writes, [' how ', 'a rainbow forms.'])
})
test('acceptWord falls back to full accept for single-word suggestions and stops when ineligible', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.requests[0]!.resolve({ text: 'next' }); await flush()
  assert.ok(f.controller.acceptWord()); assert.deepEqual(f.writes, ['next']); assert.equal(f.controller.suggestion, '')
  const g = fixture(); g.controller.reconcile(); g.state.eligible = false
  assert.equal(g.controller.acceptWord(), false); assert.deepEqual(g.writes, [])
})
test('manual trigger bypasses dedupe once and waits out the interval', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.requests[0]!.resolve({ text: 'first' }); await flush()
  f.controller.dismiss()
  f.controller.reconcile(); t.mock.timers.tick(8000); assert.equal(f.requests.length, 1)
  f.controller.manualTrigger()
  assert.equal(f.requests.length, 2)
  f.requests[1]!.resolve({ text: 'second' }); await flush()
  assert.equal(f.controller.suggestion, 'second')
  f.controller.accept()
  f.controller.manualTrigger()
  t.mock.timers.tick(7999); assert.equal(f.requests.length, 2)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 3)
})
test('manual trigger is a no-op while pending, with a visible suggestion, or ineligible', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.state.eligible = false
  f.controller.manualTrigger(); assert.equal(f.requests.length, 0)
  f.state.eligible = true
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.controller.manualTrigger(); assert.equal(f.requests.length, 1)
  f.requests[0]!.resolve({ text: 'shown' }); await flush()
  f.controller.manualTrigger(); assert.equal(f.requests.length, 1)
  f.controller.dismiss(); f.state.eligible = false
  f.controller.manualTrigger(); assert.equal(f.requests.length, 1)
})
test('deleting accidental input restores the shown suggestion without a new request', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.requests[0]!.resolve({ text: '原来的建议' }); await flush()
  assert.equal(f.controller.suggestion, '原来的建议')
  f.state.key = 'typed'; f.controller.reconcile()
  assert.equal(f.controller.suggestion, ''); assert.equal(f.requests.length, 1)
  f.state.key = 'a'; f.controller.reconcile()
  assert.equal(f.controller.suggestion, '原来的建议'); assert.equal(f.controller.message, '')
  t.mock.timers.tick(30000); assert.equal(f.requests.length, 1)
})
test('empty results escalate backoff across drafts', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.requests[0]!.resolve({ text: '' }); await flush()
  f.state.key = 'd1'; f.controller.reconcile()
  t.mock.timers.tick(7999); assert.equal(f.requests.length, 1)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 2)
  f.requests[1]!.resolve({ text: '' }); await flush()
  f.state.key = 'd2'; f.controller.reconcile()
  t.mock.timers.tick(15999); assert.equal(f.requests.length, 2)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 3)
  f.requests[2]!.resolve({ text: '' }); await flush()
  f.state.key = 'fresh'; f.controller.reconcile()
  t.mock.timers.tick(29999); assert.equal(f.requests.length, 3)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 4)
})
test('a shown suggestion resets the backoff to the base interval', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(800)
  f.requests[0]!.resolve({ text: '' }); await flush()
  f.state.key = 'd1'; f.controller.reconcile(); t.mock.timers.tick(8000)
  f.requests[1]!.resolve({ text: '' }); await flush()
  f.state.key = 'd2'; f.controller.reconcile(); t.mock.timers.tick(16000)
  f.requests[2]!.resolve({ text: '好了' }); await flush()
  assert.equal(f.controller.suggestion, '好了')
  t.mock.timers.tick(8000)
  f.state.key = 'd3'; f.controller.reconcile()
  t.mock.timers.tick(799); assert.equal(f.requests.length, 3)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 4)
})
