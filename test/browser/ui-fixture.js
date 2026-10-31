import { localeFixture } from './locale-fixture.js'
// Actual built plugin + shipped DSH React/primitives. Only Host services are fixtures.
import { createHostModules } from './host/modules.js'
import { runChecks } from './single-button.js'

const modules = createHostModules()
const { createElement: h } = modules.react
const { createRoot } = modules['react-dom/client']
const { Context, Service } = modules['@deepseek-ai/cordis']
const { Button, Modal } = modules['@deepseek-ai/dsh-client-ui-primitives']
const root = createRoot(document.getElementById('root'))
let client
window.__ModuleLoader__ = { load: definition => { client = definition.factory(name => {
  if (!(name in modules)) throw new Error(`Missing host module ${name}`)
  return modules[name]
}) } }
await import('./client.js')

const clone = value => structuredClone(value)
function store(value) {
  const listeners = new Set()
  return { getSnapshot: () => value, subscribe: callback => { listeners.add(callback); return () => listeners.delete(callback) },
    set: next => { value = next; for (const listener of listeners) listener() } }
}
const initial = '帮我检查登录页面的交互，先列出问题，不要直接改代码。'
const defaults = { mode: 'moderate', adoption: 'direct', context: 'recent', modelStrategy: 'follow', dedicated: null, mystery: false, predictionEnabled: false }
const models = [{ provider: 'fixture', model: 'fixture-model', label: '测试模型（固定响应）', efforts: ['low', 'high'] }]
let saved = clone(defaults), modelsAvailable = true, failSave = false, autoComplete = true
let settingsOpen = false, sessionId = 'ui-test-1', generation = 0, running = false, results = []
const requests = [], writes = [], slots = new Map()
const inputState = store({ draft: initial, draftRev: 0, occurrences: [], attachmentIds: ['fixture-attachment'], phase: 'plain', claim: null })
const sessionState = store({ removed: false, openState: 'open', subagent: null })
const modelState = store({ status: 'ready', routable: true, current: { provider: 'fixture', model: 'fixture-model', reasoningEffort: 'high' } })
const blocks = store(null), sessionStatus = store(new Map())
const capabilities = () => ({ owner: true, memory: false, models: modelsAvailable ? clone(models) : [] })
const complete = (index = requests.length - 1, error) => {
  const request = requests[index]
  if (!request || request.completed) return
  request.completed = true
  if (error) request.resolve({ ok: false, error: { message: error } })
  else request.resolve({ ok: true, value: { text: `${request.request.draft}\n\n按严重程度列出问题，说明位置、影响和建议。`, selection: request.request.selection,
    context: { sources: [{ kind: 'conversation', label: '最近对话 · 测试来源', text: '用户：只检查登录页。\n助手：先报告问题，不修改代码。' }], warnings: ['记忆服务不可用（测试提示）。'] } } })
}
const ctx = new Context()
const locale = localeFixture(ctx)
const session = { ctx: new Context(), session: sessionState }
ctx.provide('sessions', { binding: id => id === sessionId ? session : undefined })
ctx.provide('conversation', { input: { for: () => ({ state: inputState, setDraft: draft => {
  writes.push(clone(draft))
  const state = inputState.getSnapshot()
  inputState.set({ ...state, draft: draft.text, occurrences: draft.references.map((ref, i) => ({ ...ref, occurrenceId: `ref-${i}` })), draftRev: state.draftRev + 1 })
} }) }, blocks: { storeFor: () => blocks } })
ctx.provide('modelDirectories', { directoryFor: () => ({ store: modelState, load: async () => {} }) })
ctx.provide('uiSession', { sessionStatus })
ctx.provide('remote.session', {})
const promptRemote = {
  capabilities: async () => ({ ok: true, value: capabilities() }),
  getSettings: async () => ({ ok: true, value: clone(saved) }),
  saveSettings: async value => {
    if (failSave) return { ok: false, error: { message: '测试保存失败，请重试。' } }
    saved = clone(value)
    return { ok: true, value: clone(saved) }
  },
  enhance: (request, signal) => new Promise(resolve => {
    requests.push({ request: clone(request), signal, resolve, completed: false })
    if (autoComplete) { const index = requests.length - 1; setTimeout(() => complete(index), 150) }
  }),
}
ctx.provide('remote.promptEnhance', promptRemote)
ctx.provide('remote', { promptEnhance: promptRemote, $mount: async () => () => {} })
class SlotsFixture extends Service {
  constructor(context) { super(context, 'slots') }
  inject(_name, callback) { return this.ctx.effect(callback) }
  register(options, component) { slots.set(options.name, { options, component }); return () => slots.delete(options.name) }
}
await ctx.plugin(SlotsFixture)
const disposePlugin = await client.apply(ctx)
const buttonSlot = slots.get('conversation.input.right'), settingsSlot = slots.get('settings.section')
const settings = settingsSlot.options.inject().settings
await settings.load()
let bindingProps = buttonSlot.options.inject(sessionId)
function render() {
  root.render(h('main', { className: 'fixture', 'data-ui-fixture': 'prompt-enhance-rc3' },
    h('header', null, h('div', null, h('h1', null, 'Prompt Enhance 正式组件验收'), h('small', null, '正式插件构建与 DSH 0.2.1-rc.3 原生组件；Host / 模型为测试夹具，不发送消息。')),
      h('div', { className: 'fixture-actions' }, h(Button, { variant: 'ghost', onClick: () => { const dark = document.body.toggleAttribute('data-ds-dark-theme'); document.documentElement.style.colorScheme = dark ? 'dark' : 'light'; render() } }, '切换深浅主题'),
        h(Button, { onClick: () => { settingsOpen = true; render() } }, 'DSH 设置 → 提示词增强'))),
    h('div', { className: 'fixture-composer' }, h('textarea', { 'aria-label': '验收草稿', value: inputState.getSnapshot().draft, onChange: event => edit(event.target.value) }),
      h('div', { className: 'fixture-composer-tools' }, h(buttonSlot.component, { ...bindingProps, key: generation }), h('span', { className: 'fixture-model' }, '测试模型 · high'))),
    h('div', { className: 'fixture-geometry' }, '按钮位于模型选择器左侧；附件为测试身份，来源来自固定测试响应。'),
    h(Modal, { open: settingsOpen, title: 'DSH 设置', closeLabel: '关闭设置', className: 'dsh-prompt-enhance-dialog', contentClassName: 'dsh-prompt-enhance-dialog-body', onClose: () => { settingsOpen = false; render() } }, h(settingsSlot.component, { settings })),
    h('section', { className: 'fixture-checks' }, h(Button, { disabled: running, onClick: async () => {
      running = true; results = []; render()
      try { await runChecks(harness, line => { results.push(line); render() }) }
      catch (error) { results.push(`FAIL: ${error.message}`) }
      finally { running = false; render() }
    } }, running ? '正在验证…' : '运行 UI 回归'), h('pre', { className: 'fixture-results', 'aria-label': 'UI 回归结果', role: 'status' }, results.join('\n')))))
}
function edit(text) { const state = inputState.getSnapshot(); inputState.set({ ...state, draft: text, draftRev: state.draftRev + 1, occurrences: [] }) }
const harness = {
  setLocale: locale.setLocale,
  initial, settings, requests, writes, inputState, modelState, complete, edit,
  setAuto: value => { autoComplete = value },
  setModels: value => { modelsAvailable = value },
  setSaveFailure: value => { failSave = value },
  saved: () => clone(saved),
  configure: value => { saved = { ...clone(defaults), ...clone(value) }; settings.value = clone(saved); settings.capabilities = capabilities(); settings.notify() },
  openSettings: () => { settingsOpen = true; render() },
  closeSettings: () => { settingsOpen = false; render() },
  switchSession: () => { sessionId = `ui-test-${++generation + 1}`; inputState.set({ ...inputState.getSnapshot(), draft: '另一会话的草稿', draftRev: 0 }); bindingProps = buttonSlot.options.inject(sessionId); render() },
  dispose: disposePlugin,
}
inputState.subscribe(render)
document.body.setAttribute('data-ds-dark-theme', '')
document.documentElement.style.colorScheme = 'dark'
render()

window.harness = harness
