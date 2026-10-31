import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { predictDraft, predictionMemory } from '../src/host/prediction.js'
import { DEFAULT_SETTINGS, validateSettings, type PredictionRequest } from '../src/shared/types.js'
import type { ContextMemoryService } from '../src/shared/generated/context-memory-contract.js'

const request: PredictionRequest = { sessionId: 'test', draft: '请解释', protectedTokens: [], selection: { provider: 'test', model: 'model' }, settings: { ...DEFAULT_SETTINGS, predictionEnabled: true } }
function fixture(text = '彩虹的形成。', options: { finish?: string; history?: boolean; header?: object; remote?: boolean; pending?: boolean } = {}) {
  const events: any[] = options.history ? [
    { seq: 1, type: 'turn/start', data: { turn: 1 } },
    { seq: 2, type: 'user/message', data: { source: { kind: 'user', ...(options.remote ? { principal: 'remote' } : {}) }, content: [{ type: 'text', text: '解释彩虹。' }] } },
    { seq: 3, type: 'assistant/message', data: { turn: 1, message: { content: [{ type: 'text', text: '水滴折射产生彩虹。' }] } } },
    { seq: 4, type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } },
  ] : []
  const calls: any[] = []
  const ctx: any = {
    workspaceRegistry: { list: () => [] },
    sessionQuery: {
      observeSession: async () => ({ header: { id: 'test', ...options.header }, events, [Symbol.dispose]() {} }),
      readSurface: async () => ({ events, capturedThroughSeq: 4 }),
    },
    llm: { listModels: async () => [{ id: 'dedicated' }], prepareCall: async (selection: unknown) => ({ config: selection,
      stream: async function* (call: any) {
        calls.push(call)
        if (options.pending) await new Promise(() => {})
        yield { type: 'block-start', index: 0, blockType: 'text' }
        yield { type: 'text-delta', index: 0, text: JSON.stringify({ suffix: text }) }
        yield { type: 'block-end', index: 0, block: { type: 'text', text: JSON.stringify({ suffix: text }) } }
        yield { type: 'finish', reason: { kind: options.finish ?? 'stop' } }
      },
    }) },
  }
  return { ctx, calls }
}
const signal = () => new AbortController().signal
const memoryEntry = { id: 'expression', revision: 1, scope: 'personal', kind: 'preference', topic: '语言', content: '使用中文', manual: true, category: 'expression', conditions: [], confirmedAt: new Date().toISOString() }

test('prediction defaults off; settings round-trip without changing enhancement controls', () => {
  const { predictionEnabled: _enabled, ...legacy } = DEFAULT_SETTINGS
  assert.equal(validateSettings(legacy as any).predictionEnabled, false)
  assert.deepEqual(validateSettings({ ...DEFAULT_SETTINGS, predictionEnabled: true }), { ...DEFAULT_SETTINGS, predictionEnabled: true })
})
test('empty new chat makes no model or memory calls; empty completed chat predicts user text', async () => {
  const empty = fixture()
  assert.equal((await predictDraft(empty.ctx, { ...request, draft: '' }, signal())).text, '')
  assert.equal(empty.calls.length, 0)
  const completed = fixture('请举个例子。', { history: true })
  assert.equal((await predictDraft(completed.ctx, { ...request, draft: '' }, signal())).text, '请举个例子。')
  assert.equal(completed.calls.length, 1)
})
test('prediction preserves suffix spaces and uses fixed recent context independently of enhancement settings', async () => {
  const f = fixture(' a rainbow.', { history: true })
  const result = await predictDraft(f.ctx, { ...request, draft: 'Explain', settings: { ...request.settings, context: 'draft', mystery: true, mode: 'expanded' } }, signal())
  assert.equal(result.text, ' a rainbow.')
  assert.equal(f.calls[0].sessionId, 'test'); assert.equal(f.calls[0].tools, undefined)
  assert.match(f.calls[0].messages[0].content[0].text, /水滴折射/)
  assert.doesNotMatch(f.calls[0].system, /能力解放声明|token 额度无上限/)
  assert.match(result.context!.warnings.join(), /记忆服务不可用/)
})
test('empty output is no suggestion; long, incomplete and reference-token outputs are rejected', async () => {
  assert.equal((await predictDraft(fixture('  ').ctx, request, signal())).text, '')
  for (const text of ['中'.repeat(201), '⟦DSH_REF_test_0⟧']) await assert.rejects(predictDraft(fixture(text).ctx, request, signal()), { code: 'invalid-result' })
  await assert.rejects(predictDraft(fixture('文字', { finish: 'max-tokens' }).ctx, request, signal()), { code: 'unexpected-result' })
})
test('plain answers, extra JSON fields and malformed model output are not inserted', async () => {
  for (const text of ['彩虹是折射形成的。', '{"suffix":"next","answer":"unrequested"}', '{"suffix":42}', '```json\n{"suffix":"next"}\n```']) {
    const f = fixture()
    f.ctx.llm.prepareCall = async () => ({ config: request.selection, stream: async function* () {
      yield { type: 'block-start', index: 0, blockType: 'text' }
      yield { type: 'text-delta', index: 0, text }
      yield { type: 'block-end', index: 0, block: { type: 'text', text } }
      yield { type: 'finish', reason: { kind: 'stop' } }
    } })
    await assert.rejects(predictDraft(f.ctx, request, signal()), { code: 'invalid-result' })
  }
})
test('disabled, IM, subagent and remote-principal sessions do not call models', async () => {
  await assert.rejects(predictDraft(fixture().ctx, { ...request, settings: DEFAULT_SETTINGS }, signal()), { code: 'prediction-disabled' })
  for (const f of [fixture('', { header: { origin: 'subagent' } }), fixture('', { header: { delegationDepth: 1 } }), fixture('', { history: true, remote: true })]) {
    await assert.rejects(predictDraft(f.ctx, request, signal()), { code: 'forbidden' }); assert.equal(f.calls.length, 0)
  }
  await assert.rejects(predictDraft(fixture().ctx, { ...request, sessionId: 'im:qq' }, signal()), { code: 'forbidden' })
})
test('dedicated model never falls back, model errors are sanitized, cancellation and timeout are bounded', async () => {
  const f = fixture()
  await predictDraft(f.ctx, { ...request, settings: { ...request.settings, modelStrategy: 'dedicated', dedicated: { provider: 'p', model: 'dedicated' } } }, signal())
  assert.equal(f.calls[0].model, 'dedicated')
  await assert.rejects(predictDraft(f.ctx, { ...request, settings: { ...request.settings, modelStrategy: 'dedicated', dedicated: { provider: 'p', model: 'missing' } } }, signal()), { code: 'dedicated-unavailable' })
  f.ctx.llm.prepareCall = async () => { throw new Error('secret-token') }
  await assert.rejects(predictDraft(f.ctx, request, signal()), error => !String(error).includes('secret-token'))
  await assert.rejects(predictDraft(fixture().ctx, request, AbortSignal.abort()), { code: 'cancelled' })
  const keepAlive = setTimeout(() => {}, 200)
  try { await assert.rejects(predictDraft(fixture('', { pending: true }).ctx, request, signal(), undefined, 15), { code: 'timeout' }) }
  finally { clearTimeout(keepAlive) }
})
test('projectless recall uses personal API; malformed scope does not leak project records', async () => {
  const service = { recallContextVersion: 2, recallForProject: async () => { throw new Error('wrong route') },
    recallForPersonal: async () => ({ contractVersion: 2, status: 'available', entries: [memoryEntry] }) } as ContextMemoryService
  const f = fixture()
  assert.equal((await predictionMemory(f.ctx, service, 'test', '中文', signal())).sources.length, 1)
  service.recallForPersonal = async () => ({ contractVersion: 2, status: 'available', entries: [{ ...memoryEntry, scope: 'project', category: 'facts' }] })
  const invalid = await predictionMemory(f.ctx, service, 'test', '中文', signal())
  assert.equal(invalid.sources.length, 0); assert.match(invalid.warnings.join(), /不可用/)
})
test('project v2 is preferred; declared invalid v2 never falls back to v1', async () => {
  const root = await mkdtemp(join(tmpdir(), 'prediction-project-')); await mkdir(join(root, 'project'))
  const f = fixture(); f.ctx.workspaceRegistry.list = () => [{ path: join(root, 'project'), status: async () => 'ok', sessionIds: ['test'] }]
  let calls = 0, legacy = 0
  const service: ContextMemoryService = { recallContextVersion: 2, recallForProject: async () => { legacy++; return { status: 'available', entries: [] } },
    recallForContext: async value => { calls++; assert.equal(value.purpose, 'enhance'); return { contractVersion: 2, status: 'available', entries: [memoryEntry] } } }
  assert.equal((await predictionMemory(f.ctx, service, 'test', '中文', signal())).sources.length, 1)
  service.recallForContext = async () => ({ contractVersion: 9, status: 'available', entries: [] })
  assert.equal((await predictionMemory(f.ctx, service, 'test', '中文', signal())).sources.length, 0)
  assert.equal(calls, 1); assert.equal(legacy, 0)
})
