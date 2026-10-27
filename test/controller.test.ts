import test from 'node:test'
import assert from 'node:assert/strict'
import { EnhanceController } from '../src/client/controller.js'
import type { ComposerSnapshot } from '../src/client/controller.js'
import type { EnhanceRequest, EnhanceResponse } from '../src/shared/types.js'
import { DEFAULT_SETTINGS } from '../src/shared/types.js'

function harness(validateSelection?: (selection: unknown, signal: AbortSignal) => Promise<boolean>) {
  let state: ComposerSnapshot = {
    sessionId: 's1', revision: 1, draft: { text: '解释闭包', references: [] },
    attachmentIds: ['image-1'], selection: { provider: 'test', model: 'm1', reasoningEffort: 'high' }, available: true,
  }
  let settle!: (value: EnhanceResponse) => void
  let reject!: (reason: Error) => void
  const requests: { request: EnhanceRequest; signal: AbortSignal }[] = []
  const writes: unknown[] = []
  const controller = new EnhanceController({
    read: () => state,
    write: draft => { writes.push(draft); state = { ...state, draft, revision: state.revision + 1 } },
    enhance: (request, signal) => {
      requests.push({ request, signal })
      return new Promise((resolve, fail) => { settle = resolve; reject = fail })
    },
    nonce: () => 'test', changed: () => {},
    validateSelection,
  })
  return { controller, requests, writes,
    read: () => state,
    change: (patch: Partial<ComposerSnapshot>) => { state = { ...state, ...patch } },
    settle: (text: string) => settle({ text }),
    reject: (error: Error) => reject(error),
  }
}

test('selected model, effort and mode are captured; success fills without sending and retains attachments', async () => {
  const h = harness()
  const run = h.controller.start('expanded')
  assert.equal(h.requests[0]?.request.mode, 'expanded')
  assert.deepEqual(h.requests[0]?.request.selection, h.read().selection)
  h.settle('用一个简短例子解释 JavaScript 闭包。')
  await run
  assert.equal(h.read().draft.text, '用一个简短例子解释 JavaScript 闭包。')
  assert.deepEqual(h.read().attachmentIds, ['image-1'])
  assert.equal(h.controller.canUndo, true)
  h.controller.restore()
  assert.equal(h.read().draft.text, '解释闭包')
  assert.equal(h.controller.canUndo, false)
})

test('failed or cancelled second enhancement preserves last valid undo', async () => {
  for (const cancel of [false, true]) {
    const h = harness()
    const first = h.controller.start('moderate'); h.settle('first result'); await first
    const second = h.controller.start('expanded')
    if (cancel) { h.controller.cancel(); h.settle('late result') } else h.reject(new Error('failure'))
    await second
    assert.equal(h.controller.canUndo, true)
    h.controller.restore()
    assert.equal(h.read().draft.text, '解释闭包')
  }
})

test('preview snapshots settings, preserves draft on close, adopts only after explicit acceptance', async () => {
  const h = harness(async () => true)
  const settings = { ...DEFAULT_SETTINGS, adoption: 'preview' as const }
  const run = h.controller.start('moderate', settings)
  settings.context = 'extended'
  assert.equal(h.requests[0]!.request.settings!.context, 'recent')
  h.settle('preview'); await run
  assert.equal(h.writes.length, 0)
  assert.ok(h.controller.preview)
  h.controller.closePreview(); assert.equal(h.writes.length, 0)
  const next = h.controller.start('moderate', DEFAULT_SETTINGS, true)
  h.settle('accepted'); await next; await h.controller.acceptPreview()
  assert.equal(h.read().draft.text, 'accepted')
  assert.deepEqual(h.read().attachmentIds, ['image-1'])
  h.controller.restore(); assert.equal(h.read().draft.text, '解释闭包')
})

test('preview cannot overwrite edits during model revalidation or use a removed model', async () => {
  let finish!: (value: boolean) => void
  const h = harness(() => new Promise(resolve => { finish = resolve }))
  const run = h.controller.start('moderate', DEFAULT_SETTINGS, true); h.settle('result'); await run
  const accepting = h.controller.acceptPreview()
  h.change({ revision: 8, draft: { text: 'new input', references: [] } })
  finish(true); await accepting
  assert.equal(h.writes.length, 0)
  const removed = harness(async () => false)
  const r = removed.controller.start('moderate', DEFAULT_SETTINGS, true); removed.settle('result'); await r
  await removed.controller.acceptPreview(); assert.equal(removed.writes.length, 0)
})

test('preview drops on session switch, attachment change, model change and disposal', async () => {
  for (const patch of [{ sessionId: 's2' }, { attachmentIds: [] }, { selection: { provider: 'other', model: 'm2' } }]) {
    const h = harness()
    const run = h.controller.start('moderate', DEFAULT_SETTINGS, true); h.settle('result'); await run
    h.change(patch); h.controller.reconcile(); await h.controller.acceptPreview()
    assert.equal(h.controller.preview, undefined); assert.equal(h.writes.length, 0)
  }
})

test('double click creates only one request', async () => {
  const h = harness()
  const first = h.controller.start('moderate')
  await h.controller.start('expanded')
  assert.equal(h.requests.length, 1)
  h.settle('增强草稿')
  await first
})

for (const [name, patch] of Object.entries({
  edited: { revision: 2, draft: { text: '新输入', references: [] } },
  sent: { revision: 2, draft: { text: '', references: [] } },
  session: { sessionId: 's2' },
  model: { selection: { provider: 'test', model: 'm2' } },
  attachments: { attachmentIds: ['image-2'] },
  locked: { available: false },
})) {
  test(`${name}: changes cancel and late success never overwrites`, async () => {
    const h = harness()
    const run = h.controller.start('moderate')
    h.change(patch)
    h.controller.reconcile()
    assert.equal(h.requests[0]?.signal.aborted, true)
    h.settle('迟到结果')
    await run
    assert.equal(h.writes.length, 0)
  })
}

test('last-moment revision change is checked even before subscription reconciliation', async () => {
  const h = harness()
  const run = h.controller.start('moderate')
  h.change({ revision: 2 })
  h.settle('结果')
  await run
  assert.equal(h.writes.length, 0)
})

test('restoring cannot overwrite an edit after enhancement', async () => {
  const h = harness()
  const run = h.controller.start('moderate')
  h.settle('增强草稿')
  await run
  h.change({ revision: 3, draft: { text: '后续输入', references: [] } })
  h.controller.restore()
  assert.equal(h.read().draft.text, '后续输入')
})

test('cancelled old request cannot settle a newer request', async () => {
  const h = harness()
  const old = h.controller.start('moderate')
  h.controller.cancel()
  h.settle('旧结果')
  const next = h.controller.start('expanded')
  await old
  assert.equal(h.controller.pending, true)
  h.settle('新结果')
  await next
  assert.equal(h.read().draft.text, '新结果')
})

test('dispose cancels and refuses writes; rejection keeps the original', async () => {
  const h = harness()
  const run = h.controller.start('moderate')
  h.controller.dispose()
  h.settle('结果')
  await run
  assert.equal(h.writes.length, 0)
  assert.equal(h.requests[0]?.signal.aborted, true)
  const second = harness()
  const failed = second.controller.start('moderate')
  second.reject(new Error('模型不可用'))
  await failed
  assert.equal(second.read().draft.text, '解释闭包')
  assert.equal(second.controller.message, '模型不可用')
})
