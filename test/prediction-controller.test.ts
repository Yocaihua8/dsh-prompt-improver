import test from 'node:test'
import assert from 'node:assert/strict'
import { PredictionController, type PredictionSnapshot } from '../src/client/prediction-controller.js'
import { DEFAULT_SETTINGS, type PredictionResponse } from '../src/shared/types.js'
const flush = async () => { await Promise.resolve(); await Promise.resolve() }
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
test('800ms debounce, 3s throttle, only latest snapshot may show; no implicit writes', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); const f = fixture(); t.after(() => f.controller.dispose())
  f.controller.reconcile(); t.mock.timers.tick(799); assert.equal(f.requests.length, 0)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 1)
  f.state.key = 'b'; f.controller.reconcile(); assert.ok(f.requests[0]!.signal.aborted)
  f.requests[0]!.resolve({ text: 'stale' }); await flush(); assert.equal(f.controller.suggestion, '')
  t.mock.timers.tick(2999); assert.equal(f.requests.length, 1)
  t.mock.timers.tick(1); assert.equal(f.requests.length, 2)
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
  f.state.key = 'settings'; f.controller.reconcile(); t.mock.timers.tick(800)
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
