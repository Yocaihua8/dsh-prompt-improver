import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import { Context, Service } from '@deepseek-ai/cordis'

test('browser bundle uses host modules and disposes remote, slot and style when unloaded', async () => {
  const require = createRequire(import.meta.url)
  let client!: { apply: (ctx: Context) => unknown; inject: string[] }
  const state = { remote: 0, slots: 0, styles: 0 }
  const sandbox = {
    structuredClone, AbortController, AbortSignal,
    window: { __ModuleLoader__: { load: (definition: { id: string; factory: (require: (name: string) => unknown) => typeof client }) => {
      assert.equal(definition.id, 'dsh-link-prompt-enhance')
      client = definition.factory(name => name === '@deepseek-ai/dsh-client-ui-primitives' ? {} : require(name))
    } } },
    document: {
      createElement: () => ({ dataset: {}, textContent: '', remove: () => { state.styles-- } }),
      head: { append: () => { state.styles++ } },
    },
  }
  vm.runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), sandbox)
  assert.ok(client)
  const ctx = new Context()
  for (const name of ['sessions', 'conversation', 'modelDirectories', 'uiSession']) ctx.provide(name, {})
  class SlotsFixture extends Service {
    constructor(ctx: Context) { super(ctx, 'slots') }
    inject(_name: string, callback: () => () => void) { return this.ctx.effect(callback) }
    register(options: { name: string }) {
      assert.ok(['conversation.input.right', 'settings.section'].includes(options.name))
      state.slots++
      return () => { state.slots-- }
    }
  }
  const slots = ctx.plugin(SlotsFixture)
  await slots
  ctx.provide('remote.session', {})
  ctx.provide('remote.promptEnhance', {})
  ctx.provide('remote', { $mount: async (contribution: { package: string }) => {
    assert.equal(contribution.package, 'dsh-link-prompt-enhance')
    state.remote++
    return () => { state.remote-- }
  } })
  const plugin = ctx.plugin(client)
  await plugin
  assert.deepEqual(state, { remote: 1, slots: 2, styles: 1 })
  await plugin.dispose()
  assert.deepEqual(state, { remote: 0, slots: 0, styles: 0 })
  await slots.dispose()
})
