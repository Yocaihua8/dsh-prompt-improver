import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, realpath, symlink } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawn } from 'node:child_process'
import type { Context } from '@deepseek-ai/cordis'
import { SettingsStore } from '../src/host/settings.js'
import { DEFAULT_SETTINGS, applyTemplate, validateSettings } from '../src/shared/types.js'
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

test('templates persist, silent-invalid entries are filtered, defaultAction falls back and the predict snapshot stays consistent', async () => {
  const root = await mkdtemp(join(tmpdir(), 'prompt-templates-'))
  const store = new SettingsStore(join(root, 'settings.json'))
  // 归一：缺省无模板，validateSettings 幂等
  const base = validateSettings({ ...DEFAULT_SETTINGS })
  assert.equal(base.templates, undefined)
  assert.equal(base.defaultAction, undefined)
  const template = { id: 't1', name: '代码审查', text: '审查以下内容：{draft}' }
  const withTemplate = validateSettings({ ...DEFAULT_SETTINGS, templates: [template] })
  assert.deepEqual(withTemplate.templates, [template])
  assert.equal(withTemplate.templates![0].text, '审查以下内容：{draft}')
  // 无效条目静默过滤：名称空、缺占位符、多占位符、超长、重复 id
  const filtered = validateSettings({
    ...DEFAULT_SETTINGS,
    templates: [
      template,
      { id: 't2', name: '', text: 'x {draft}' },
      { id: 't3', name: '无占位', text: '没有占位' },
      { id: 't4', name: '双占位', text: '{draft}{draft}' },
      { id: 't5', name: '超长', text: 'x'.repeat(2001) + '{draft}' },
      { id: 't1', name: '重复', text: 'dup {draft}' },
    ],
  })
  assert.deepEqual(filtered.templates, [template])
  // defaultAction：指向存在的模板保留，缺失/空模板回落 enhance
  assert.deepEqual(validateSettings({ ...DEFAULT_SETTINGS, templates: [template], defaultAction: { kind: 'template-apply', templateId: 't1' } }).defaultAction,
    { kind: 'template-apply', templateId: 't1' })
  assert.equal(validateSettings({ ...DEFAULT_SETTINGS, templates: [template], defaultAction: { kind: 'template-adapt', templateId: 'gone' } }).defaultAction, undefined)
  assert.equal(validateSettings({ ...DEFAULT_SETTINGS, defaultAction: { kind: 'template-apply', templateId: 't1' } }).defaultAction, undefined)
  assert.equal(validateSettings({ ...DEFAULT_SETTINGS, templates: [template], defaultAction: { kind: 'enhance' } }).defaultAction, undefined)
  // 本地套用：占位符替换 + $ 序列陷阱安全
  assert.equal(applyTemplate(template, '草稿$&$`'), '审查以下内容：草稿$&$`')
  // settings.json 读写往返
  const file = join(root, 'settings.json')
  await store.save(withTemplate)
  const roundTrip = validateSettings(await new SettingsStore(file).read())
  assert.deepEqual(roundTrip.templates, [template])
  assert.deepEqual(roundTrip.defaultAction, undefined)
  // predict 一致性：设置快照（含模板）与保存值归一后序列化一致，不误报 settings-changed
  const saved = validateSettings(withTemplate)
  const snapshot = validateSettings({ ...saved })
  assert.equal(JSON.stringify(saved), JSON.stringify(snapshot))
}) 

test('mystery injection defaults to off for existing files and round-trips', async () => {
  const root = await mkdtemp(join(tmpdir(), 'prompt-settings-mystery-'))
  const file = join(root, 'settings.json')
  await writeFile(file, JSON.stringify({ mode: 'expanded', adoption: 'direct', context: 'recent', modelStrategy: 'follow', dedicated: null }))
  const store = new SettingsStore(file)
  assert.equal((await store.read()).mystery, false)
  await store.save({ ...DEFAULT_SETTINGS, mystery: true })
  assert.equal((await new SettingsStore(file).read()).mystery, true)
})

test('custom instructions persist trimmed, stay absent when blank and enforce the length cap', async () => {
  const root = await mkdtemp(join(tmpdir(), 'prompt-settings-custom-'))
  const file = join(root, 'settings.json')
  const store = new SettingsStore(file)
  await store.save({ ...DEFAULT_SETTINGS, customInstructions: '  保持简短  ' })
  assert.equal((await new SettingsStore(file).read()).customInstructions, '保持简短')
  await writeFile(file, JSON.stringify({ ...DEFAULT_SETTINGS, customInstructions: '旧值' }))
  assert.equal((await store.read()).customInstructions, '旧值')
  assert.throws(() => validateSettings({ ...DEFAULT_SETTINGS, customInstructions: '长'.repeat(501) }), /无效/)
  assert.equal('customInstructions' in validateSettings({ ...DEFAULT_SETTINGS, customInstructions: '  ' }), false)
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
