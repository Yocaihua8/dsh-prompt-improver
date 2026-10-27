import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import { TypertRegistry } from '@deepseek-ai/dsh-typert-registry'
import PromptEnhance from '../lib/index.js'
import { TYPERT } from '../lib/typert.host.js'
import { DEFAULT_SETTINGS } from '../src/shared/types.js'

test('renamed Host retains existing settings and saves them where the old version can read them', async t => {
  const home = await mkdtemp(join(tmpdir(), 'dsh-prompt-improver-compat-'))
  const previousHome = process.env.DSH_HOME
  process.env.DSH_HOME = home
  t.after(async () => {
    if (previousHome === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = previousHome
    assert.equal(dirname(home), tmpdir())
    await rm(home, { recursive: true, force: true })
  })
  const file = join(home, 'plugins', 'dsh-link-prompt-enhance', 'settings.json')
  await mkdir(dirname(file), { recursive: true })
  const settings = { ...DEFAULT_SETTINGS, mode: 'expanded', context: 'draft', adoption: 'preview',
    modelStrategy: 'dedicated', dedicated: { provider: 'demo-provider', model: 'demo-model' } } as const
  const original = JSON.stringify(settings, null, 2) + '\n'
  await writeFile(file, original)
  const ctx = new Context()
  for (const name of ['llm', 'sessionQuery', 'workspaceRegistry', 'subprocess']) ctx.provide(name, {})
  ctx.provide('invocation', { peer: { principal: { kind: 'owner' } } })
  const registry = ctx.plugin(TypertRegistry); await registry
  t.after(() => registry.dispose())
  const unregister = ctx.typert.register(TYPERT)
  t.after(unregister)
  const plugin = ctx.plugin(PromptEnhance); await plugin
  t.after(() => plugin.dispose())
  const signal = new AbortController().signal
  assert.deepEqual(await ctx.promptEnhance.getSettings('moderate', signal), settings)
  assert.equal(await readFile(file, 'utf8'), original)
  const updated = { ...settings, adoption: 'direct' as const }
  assert.deepEqual(await ctx.promptEnhance.saveSettings(updated, signal), updated)
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), updated)
  await assert.rejects(access(join(home, 'plugins', 'dsh-prompt-improver', 'settings.json')), { code: 'ENOENT' })
})
