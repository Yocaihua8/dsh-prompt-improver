import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Context } from '@deepseek-ai/cordis'
import { remoteMethods } from '@deepseek-ai/dsh-typert-protocol'
import { TypertRegistry } from '@deepseek-ai/dsh-typert-registry'
import type { StreamChunk, GenerateOptions } from '@deepseek-ai/dsh-llm'
import { enhanceDraft } from '../src/host/enhance.js'
import type { EnhanceRequest } from '../src/shared/types.js'
import { DEFAULT_SETTINGS } from '../src/shared/types.js'
import PromptEnhance from '../lib/index.js'
import { TYPERT } from '../lib/typert.host.js'

const request: EnhanceRequest = { sessionId: 'test-session', draft: '给小学生解释彩虹，不超过 200 字。', mode: 'moderate', selection: { provider: 'test-route', model: 'selected-model', reasoningEffort: 'high' }, protectedTokens: [] }
const chunks = (text = '请用小学生能理解的语言解释彩虹的形成，不超过 200 字。', finish = 'stop'): StreamChunk[] => [
  { type: 'block-start', index: 0, blockType: 'text' },
  { type: 'text-delta', index: 0, text },
  { type: 'block-end', index: 0, block: { type: 'text', text } },
  { type: 'finish', reason: { kind: finish } } as StreamChunk,
]
function fixture(stream = chunks()) {
  const calls: { selection?: unknown; options?: GenerateOptions; signal?: AbortSignal; count: number } = { count: 0 }
  const services = {
    sessionQuery: { readSurface: async () => ({ events: [], capturedThroughSeq: 0 }), readSession: async () => ({ events: [] }) },
    llm: { listModels: async () => [{ id: 'dedicated-model' }], prepareCall: async (selection: unknown, signal: AbortSignal) => {
      calls.selection = selection; calls.signal = signal; calls.count++
      return { config: { provider: 'test-route', model: 'selected-model', reasoningEffort: 'high' }, stream: async function* (options: GenerateOptions) { calls.options = options; yield* stream } }
    } },
  }
  return { services, ctx: services as unknown as Pick<Context, 'llm' | 'sessionQuery'>, calls }
}

test('both modes preserve clicked model/effort and issue a single tool-free auxiliary request', async () => {
  const prompts: string[] = []
  for (const mode of ['moderate', 'expanded'] as const) {
    const { ctx, calls } = fixture()
    assert.ok((await enhanceDraft(ctx, { ...request, mode }, new AbortController().signal)).text)
    assert.deepEqual(calls.selection, request.selection)
    assert.equal(calls.options!.reasoningEffort, 'high')
    assert.equal(calls.count, 1)
    assert.equal(calls.options!.tools, undefined)
    assert.equal(calls.options!.sessionId, request.sessionId)
    assert.equal(calls.options!.messages.length, 1)
    prompts.push(calls.options!.system!)
  }
  assert.notEqual(prompts[0], prompts[1])
  assert.match(prompts[0]!, /原意/)
  assert.match(prompts[1]!, /验收/)
})

test('obvious language translation drift is rejected without retry', async () => {
  const english = fixture(chunks('请用英语解释闭包。'))
  await assert.rejects(enhanceDraft(english.ctx, { ...request, draft: 'Explain closures in English. No framework.' }, new AbortController().signal), { code: 'language-changed' })
  assert.equal(english.calls.count, 1)
  const chinese = fixture(chunks('Explain rainbows.'))
  await assert.rejects(enhanceDraft(chinese.ctx, request, new AbortController().signal), { code: 'language-changed' })
  assert.equal(chinese.calls.count, 1)
})

test('dedicated model is used exactly, unavailable model never falls back', async () => {
  const f = fixture()
  const selection = { provider: 'dedicated', model: 'dedicated-model', reasoningEffort: 'low' }
  const dedicated = { ...request, settings: { ...DEFAULT_SETTINGS, modelStrategy: 'dedicated' as const, dedicated: selection, context: 'draft' as const } }
  await enhanceDraft(f.ctx, dedicated, new AbortController().signal)
  assert.deepEqual(f.calls.selection, selection)
  f.services.llm.listModels = async () => []
  await assert.rejects(enhanceDraft(f.ctx, dedicated, new AbortController().signal), { code: 'dedicated-unavailable' })
  assert.equal(f.calls.count, 1)
})

test('new settings endpoints and extended context fail closed without owner invocation', async () => {
  const ctx = new Context(), f = fixture()
  ctx.provide('llm', f.ctx.llm); ctx.provide('sessionQuery', f.ctx.sessionQuery)
  ctx.provide('workspaceRegistry', { list: () => [] }); ctx.provide('subprocess', {})
  const registry = ctx.plugin(TypertRegistry); await registry
  const unregister = ctx.typert.register(TYPERT), fork = ctx.plugin(PromptEnhance); await fork
  const signal = new AbortController().signal
  await assert.rejects(ctx.promptEnhance.getSettings(undefined, signal), /所有者/)
  await assert.rejects(ctx.promptEnhance.saveSettings(DEFAULT_SETTINGS, signal), /所有者/)
  await assert.rejects(ctx.promptEnhance.enhance({ ...request, settings: { ...DEFAULT_SETTINGS, context: 'extended' } }, signal), /所有者/)
  assert.deepEqual(await ctx.promptEnhance.capabilities(signal), { owner: false, memory: false, models: [] })
  assert.equal(f.calls.count, 0)
  await fork.dispose(); unregister(); await registry.dispose()
})

for (const [name, stream, code] of [
  ['empty', chunks('  '), 'empty-result'], ['truncated', chunks('partial', 'max-tokens'), 'truncated'],
  ['missing terminal', chunks().slice(0, -1), 'unexpected-result'],
  ['tool-call', chunks('bad', 'tool-calls'), 'unexpected-result'],
  ['too long', chunks('x'.repeat(32001)), 'result-too-long'],
] as const) test(`rejects ${name} without retry`, async () => {
  const { ctx, calls } = fixture([...stream])
  await assert.rejects(enhanceDraft(ctx, request, new AbortController().signal), { code })
  assert.equal(calls.count, 1)
})

test('history failure never calls model and gives a specific reason', async () => {
  const { ctx, services, calls } = fixture()
  services.sessionQuery.readSurface = async () => { throw new Error('sensitive database path') }
  await assert.rejects(enhanceDraft(ctx, request, new AbortController().signal), { code: 'history-unavailable' })
  assert.equal(calls.count, 0)
})

test('timeout and cancellation bound even an unresponsive history reader', async () => {
  for (const cancel of [false, true]) {
    const { ctx, services, calls } = fixture()
    services.sessionQuery.readSurface = () => new Promise(() => {})
    const abort = new AbortController()
    const result = enhanceDraft(ctx, request, abort.signal, 20)
    if (cancel) abort.abort()
    await assert.rejects(result, { code: cancel ? 'cancelled' : 'timeout' })
    assert.equal(calls.count, 0)
  }
})

test('protected references are checked by Host before a result is returned', async () => {
  const token = '⟦DSH_REF_test_0⟧'
  const protectedRequest = { ...request, draft: `解释 ${token}`, protectedTokens: [token] }
  await assert.rejects(enhanceDraft(fixture(chunks('lost')).ctx, protectedRequest, new AbortController().signal), { code: 'invalid-references' })
  assert.equal((await enhanceDraft(fixture(chunks(`解释 ${token}`)).ctx, protectedRequest, new AbortController().signal)).text, `解释 ${token}`)
})

test('generated Host RPC loads and unloads with strict schema, session resource and cancellation', async () => {
  const ctx = new Context()
  const f = fixture()
  ctx.provide('llm', f.ctx.llm)
  ctx.provide('sessionQuery', f.ctx.sessionQuery)
  ctx.provide('workspaceRegistry', { list: () => [] })
  ctx.provide('subprocess', {})
  const registry = ctx.plugin(TypertRegistry)
  await registry
  const unregister = ctx.typert.register(TYPERT)
  assert.ok(ctx.typert.getPackage('dsh-prompt-improver'))
  const fork = ctx.plugin(PromptEnhance)
  await fork
  assert.ok(ctx.promptEnhance)
  const marker = remoteMethods(ctx.promptEnhance)[0]!
  assert.equal(marker.resources!.session!(request), 'test-session')
  const descriptor = TYPERT.invocations.find(item => item.method === 'enhance' || item.path === 'promptEnhance.enhance') ?? TYPERT.invocations[1]!
  assert.equal(descriptor.cancellation?.parameter, 'signal')
  assert.equal(descriptor.parameters[0]!.strictCodec!.create().safeParse({ ...request, extra: true }).success, false)
  assert.ok((await ctx.promptEnhance.enhance(request, new AbortController().signal)).text)
  f.services.sessionQuery.readSurface = () => new Promise(() => {})
  const pending = ctx.promptEnhance.enhance(request, new AbortController().signal)
  const rejection = assert.rejects(pending, /取消/)
  await fork.dispose()
  await rejection
  assert.equal(ctx.get('promptEnhance'), undefined)
  unregister()
  assert.equal(ctx.typert.getPackage('dsh-prompt-improver'), undefined)
  await registry.dispose()
})
