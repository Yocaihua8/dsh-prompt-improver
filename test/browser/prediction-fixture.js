import { localeFixture } from './locale-fixture.js'
// Actual installed rc.3 editor, chip nodes, history, native keymap, and formal plugin bundle.
import { createHostModules } from './host/modules.js'
const modules = createHostModules()
let native, plugin
window.__ModuleLoader__ = { load(definition) {
  const value = definition.factory(name => { if (!(name in modules)) throw new Error(`Missing module ${name}`); return modules[name] })
  modules[definition.id] = value
  if (value.predictionFixture) native = value.predictionFixture
  if (definition.id === 'dsh-prompt-improver') plugin = value
} }
await import('./host/native-composer.js')
await import('./client.js')
const { createElement: h, useEffect, useRef, useState } = modules.react
const { createRoot } = modules['react-dom/client']
const { Context, Service } = modules['@deepseek-ai/cordis']
const { createSnapshotStore: store } = modules['@deepseek-ai/dsh-client-store']
const ctx = new Context(), slots = new Map(), requests = [], sent = []
const locale = localeFixture(ctx)
const style = document.createElement('style'); style.textContent = native.style + '\n.fixture-native{max-width:780px;margin:80px auto}.fixture-native [data-composer-card]{margin-top:32px}.fixture-native .controls{display:flex;gap:8px;flex-wrap:wrap}.fixture-native [data-input-scroll]{max-height:160px}'; document.head.append(style)
const defaults = { mode: 'moderate', adoption: 'direct', context: 'recent', modelStrategy: 'follow', dedicated: null, mystery: false, predictionEnabled: true }
let saved = { ...defaults }, suggestion = '请用一个日常例子解释。', delay = 80, generation = 0, sessionId = 'prediction-ui-1'
const shell = new native.SessionInputShell({ actx: new Context(), defaultSink: async (...args) => { sent.push(args); return { kind: 'success' } }, commandAttachments: { unsupportedNotice: () => '', serialize: async () => [], release() {} } })
const sessionState = store({ openState: 'open', removed: false, subagent: null, running: false, pendingSubmissions: [], blank: false })
const events = store({ revision: 1, entries: [{ type: 'event', event: { type: 'turn/end', seq: 4, data: { reason: { kind: 'completed' } } } }] })
const session = { ctx: new Context(), session: sessionState, eventSource: events }
const model = store({ status: 'ready', routable: true, current: { provider: 'fixture', model: 'fixture-model' } })
const blocks = store(null), status = store(new Map())
const capabilities = { owner: true, memory: true, personalMemory: true, models: [{ provider: 'fixture', model: 'fixture-model', label: '测试模型', efforts: [] }] }
ctx.provide('sessions', { binding: id => id === sessionId ? session : undefined })
ctx.provide('conversation', { input: { for: () => shell }, blocks: { storeFor: () => blocks } })
ctx.provide('modelDirectories', { directoryFor: () => ({ store: model, load: async () => {} }) })
ctx.provide('uiSession', { sessionStatus: status }); ctx.provide('remote.session', {})
const remote = {
  capabilities: async () => ({ ok: true, value: capabilities }), getSettings: async () => ({ ok: true, value: saved }),
  saveSettings: async value => { saved = structuredClone(value); return { ok: true, value: saved } },
  predict: (request, signal) => new Promise(resolve => { const item = { request, signal, text: suggestion }; requests.push(item); setTimeout(() => resolve({ ok: true, value: { text: item.text, context: { sources: [], warnings: [] } } }), delay) }),
  enhance: async request => ({ ok: true, value: { text: request.draft + '，说明关键步骤。', selection: request.selection, context: { sources: [], warnings: [] } } }),
}
ctx.provide('remote.promptEnhance', remote); ctx.provide('remote', { promptEnhance: remote, $mount: async () => () => {} })
class Slots extends Service {
  constructor(context) { super(context, 'slots') }
  inject(_name, callback) { return this.ctx.effect(callback) }
  register(options, component) { slots.set(options.name, { options, component }); return () => slots.delete(options.name) }
}
await ctx.plugin(Slots)
const disposePlugin = await plugin.apply(ctx)
const prediction = slots.get('conversation.input.overlay'), enhance = slots.get('conversation.input.right'), settingsSlot = slots.get('settings.section')
const settings = settingsSlot.options.inject().settings; await settings.load()
const root = createRoot(document.getElementById('root'))
function App() {
  const scroll = useRef(null), [, render] = useState(0)
  useEffect(() => shell.state.subscribe(() => render(n => n + 1)), [])
  useEffect(() => native.registerComposerKeymap(shell.editor, { arbitrate: key => {
    if (document.querySelector('[data-trigger-menu]')) { if (key === 'tab') window.fixture.menuTabs++; return 'consumed' } return 'pass'
  }, dismissPopup() {}, space: () => false, canSubmit: () => true, submit: () => shell.submit(), pasteText: text => shell.paste(text), intakeFiles() {} }), [])
  const text = shell.state.getSnapshot().draft
  return h('main', { className: 'fixture-native' }, h('h1', null, '输入预测 · rc.3 原生编辑器验收'),
    h('p', null, '原生 Lexical、引用和撤销；固定响应，不连接模型，不发送真实消息。'),
    h('div', { className: 'controls' },
      h('button', { onClick: () => { document.body.toggleAttribute('data-ds-dark-theme') } }, '切换主题'),
      h('button', { onClick: async () => { await settings.save({ ...settings.value, predictionEnabled: !settings.value.predictionEnabled }); render(n => n + 1) } }, settings.value.predictionEnabled ? '关闭预测' : '开启预测'),
      h('button', { onClick: () => { window.fixture.seed('请解释'); shell.focus() } }, '填入草稿'),
      h('button', { onClick: () => { window.fixture.seed(''); shell.focus() } }, '清空草稿'),
      h('button', { onClick: () => { sessionId = `prediction-ui-${++generation + 1}`; window.fixture.seed('新会话'); events.set({ ...events.getSnapshot(), revision: generation + 1 }); render(n => n + 1); shell.focus() } }, '切换会话')),
    h('div', { className: native.css.card, 'data-composer-card': true },
      h('div', { className: native.css.overlayAnchor, 'data-composer-overlay': true }, h(prediction.component, { ...prediction.options.inject(sessionId), inputActions: shell.actions, key: sessionId })),
      h(native.DraftEditor, { classNames: native.css, editor: shell.editor, scrollRef: scroll, editable: true, editorDisabled: false, phase: 'plain', placeholderText: '输入消息', ariaLabel: '原生验收草稿', hint: null, showPlaceholder: !text }),
      h('div', { className: native.css.row }, h(enhance.component, { ...enhance.options.inject(sessionId), key: sessionId }), h('button', { onClick: () => shell.submit() }, '测试发送'))),
    h('pre', { id: 'draft-state' }, JSON.stringify({ text, refs: shell.state.getSnapshot().occurrences.length, attachments: shell.state.getSnapshot().attachmentIds, sent: sent.length }, null, 2)))
}
window.fixture = { setLocale: locale.setLocale, shell, settings, requests, sent, events, sessionState, model, blocks, menuTabs: 0,
  seed(text) { shell.setDraft(text); events.set({ ...events.getSnapshot(), revision: events.getSnapshot().revision + 1 }) },
  suggest(text) { suggestion = text }, setDelay(value) { delay = value },
  dispose: disposePlugin,
}
root.render(h(App))
