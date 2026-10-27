import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, realpath, symlink } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import type { Context } from '@deepseek-ai/cordis'
import { SettingsStore } from '../src/host/settings.js'
import { DEFAULT_SETTINGS, validateSettings } from '../src/shared/types.js'
import { collectContext, extendedContext } from '../src/host/context.js'
import { allowedProjectFile, safeFile, searchProject } from '../src/host/project.js'
import type { EnhanceRequest } from '../src/shared/types.js'

const signal = () => new AbortController().signal
const request: EnhanceRequest = { sessionId: 'test', draft: '解释 InvoiceService 的 retryLimit', mode: 'moderate', selection: { provider: 'test', model: 'test' }, protectedTokens: [], settings: { ...DEFAULT_SETTINGS } }
const subprocess = { spawn(spec: { argv: string[]; cwd: string; signal: AbortSignal }) {
  let stdout = '', stderr = ''
  const process = spawn(spec.argv[0]!, spec.argv.slice(1), { cwd: spec.cwd, signal: spec.signal, windowsHide: true })
  process.stdout.on('data', chunk => { stdout += chunk }); process.stderr.on('data', chunk => { stderr += chunk })
  return { done: new Promise((resolve, reject) => { process.on('error', reject); process.on('close', (exitCode, signal) => resolve({ exitCode, signal })) }),
    collected: { stdout: { readFrom: () => ({ text: stdout, lossy: false }) }, stderr: { readFrom: () => ({ text: stderr, lossy: false }) } } }
} }

test('settings initialize once from legacy mode, persist restart and never retain unknown secrets', async () => {
  const root = await mkdtemp(join(tmpdir(), 'prompt-settings-'))
  const file = join(root, 'nested', 'settings.json')
  const store = new SettingsStore(file)
  assert.equal((await store.read('expanded')).mode, 'expanded')
  assert.equal((await store.read('moderate')).mode, 'expanded')
  const settings = { ...DEFAULT_SETTINGS, context: 'draft' as const, modelStrategy: 'dedicated' as const, dedicated: { provider: 'p', model: 'm', reasoningEffort: 'high', apiKey: 'do-not-store' }, key: 'do-not-store' }
  await store.save(settings)
  assert.equal((await new SettingsStore(file).read()).dedicated?.reasoningEffort, 'high')
  assert.equal((await readFile(file, 'utf8')).includes('do-not-store'), false)
  await writeFile(file, 'broken')
  await assert.rejects(store.read(), /未覆盖/)
  assert.equal(await readFile(file, 'utf8'), 'broken')
  assert.throws(() => validateSettings({ ...DEFAULT_SETTINGS, modelStrategy: 'dedicated' }), /无效/)
})

test('draft context performs no history, memory or project reads', async () => {
  const ctx = { sessionQuery: { readSurface() { throw new Error('should not read') } } } as unknown as Pick<Context, 'sessionQuery'>
  const context = await collectContext(ctx, { ...request, settings: { ...DEFAULT_SETTINGS, context: 'draft' } }, signal(), { extended: async () => { throw new Error('should not read') } })
  assert.deepEqual(context, { sources: [], warnings: [] })
})

test('recent and extended history budgets retain user/assistant pairs and expose truncation', async () => {
  const events = [
    { seq: 1, type: 'turn/start', data: { turn: 1 } },
    { seq: 2, type: 'user/message', data: { source: { kind: 'user' }, content: [{ type: 'text', text: '不允许删除用户数据。'.repeat(1500) }] } },
    { seq: 3, type: 'assistant/message', data: { turn: 1, message: { content: [{ type: 'text', text: '答'.repeat(15000) }] } } },
    { seq: 4, type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } },
  ]
  const ctx = { sessionQuery: { readSurface: async () => ({ events, capturedThroughSeq: 4 }), readSession: async () => ({ events }) } } as unknown as Pick<Context, 'sessionQuery'>
  for (const mode of ['recent', 'extended'] as const) {
    let expanded = 0
    const report = await collectContext(ctx, { ...request, settings: { ...DEFAULT_SETTINGS, context: mode } }, signal(), { extended: async () => { expanded++; return { sources: [], warnings: [] } } })
    assert.equal(report.sources.length, 2)
    assert.ok(report.sources[0]!.text.startsWith('不允许删除'))
    assert.ok(report.sources.reduce((sum, item) => sum + item.text.length, 0) <= (mode === 'recent' ? 12000 : 8000))
    assert.ok(report.warnings.length)
    assert.equal(expanded, mode === 'recent' ? 0 : 1)
  }
})

test('project retrieval obeys ignore rules, credential exclusions, link boundaries, budgets and relevance', async () => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'prompt-project-')))
  await mkdir(join(root, '.git')); await mkdir(join(root, 'node_modules')); await mkdir(join(root, 'src'))
  await writeFile(join(root, '.gitignore'), 'ignored.ts\n')
  await writeFile(join(root, 'ignored.ts'), 'InvoiceService private ignored')
  await writeFile(join(root, '.env'), 'InvoiceService=secret')
  await writeFile(join(root, 'credentials.json'), 'InvoiceService secret')
  await writeFile(join(root, 'node_modules', 'dependency.ts'), 'InvoiceService dependency')
  await writeFile(join(root, 'src', 'InvoiceService.ts'), 'export const retryLimit = 3;\n// InvoiceService preserves original constraints\nconst apiKey = "secret";')
  await writeFile(join(root, 'unrelated.md'), 'totally unrelated')
  const outside = await mkdtemp(join(tmpdir(), 'prompt-outside-'))
  await writeFile(join(outside, 'InvoiceService.ts'), 'must not leave project')
  await symlink(outside, join(root, 'escape'), 'junction')
  assert.equal(await safeFile(root, 'escape/InvoiceService.ts'), null)
  assert.equal(allowedProjectFile('../outside.ts'), false)
  const report = await searchProject({ subprocess } as unknown as Pick<Context, 'subprocess'>, root, request.draft, signal())
  assert.equal(report.sources.length, 1)
  assert.match(report.sources[0]!.label, /InvoiceService.ts/)
  assert.ok(!JSON.stringify(report.sources).includes('secret'))
  assert.equal(report.warnings.length, 0)
  assert.deepEqual((await searchProject({ subprocess } as unknown as Pick<Context, 'subprocess'>, root, 'zzzzNotFound', signal())).sources, [])
})

test('extended context derives project from host session, uses read-only memory contract, reports unavailable sources', async () => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'prompt-memory-')))
  const ctx = { workspaceRegistry: { list: () => [{ sessionIds: ['test'], path: root, status: async () => 'ok' }] }, subprocess } as unknown as Pick<Context, 'workspaceRegistry' | 'subprocess'>
  let recalled = ''
  const memory = { recallForProject: async (query: { projectPath: string; query: string }) => { recalled = query.projectPath; return { status: 'available', entries: [{ id: 'a', revision: 1, scope: 'personal', kind: 'preference', topic: '中文', content: '用中文回答', manual: true }] } } }
  const report = await extendedContext(ctx, memory, request, signal())
  assert.equal(recalled, root)
  assert.equal(report.sources[0]!.kind, 'memory')
  assert.equal(report.sources[0]!.text, '用中文回答')
  assert.ok((await extendedContext(ctx, undefined, request, signal())).warnings.some(w => w.includes('记忆服务不可用')))
  assert.ok((await extendedContext(ctx, { recallForProject: async () => { throw new Error('private') } }, request, signal())).warnings.some(w => w.includes('召回失败')))
  assert.ok((await extendedContext(ctx, { recallForProject: async () => ({ contractVersion: 99 }) }, request, signal())).warnings.some(w => w.includes('接口不兼容')))
  const failed = { ...ctx, subprocess: { spawn() { throw new Error('private path') } } } as unknown as typeof ctx
  const search = await extendedContext(failed, memory, request, signal())
  assert.ok(search.warnings.some(w => w.includes('项目检索失败')))
  assert.ok(!JSON.stringify(search.warnings).includes('private'))
  assert.ok((await extendedContext(ctx, memory, { ...request, sessionId: 'other' }, signal())).warnings.some(w => w.includes('没有可用项目')))
})
