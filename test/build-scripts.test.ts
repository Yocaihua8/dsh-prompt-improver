import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { syncShared } from '../scripts/sync-shared.mjs'
import { checkFormalReleaseVersion, checkPackage } from '../scripts/package-check.mjs'

const repository = fileURLToPath(new URL('../', import.meta.url))

test('local contract sync detects stale copies without changing them and normalizes line endings', async t => {
  const root = await mkdtemp(join(tmpdir(), 'prompt-enhance-contract-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(root, 'shared'))
  await writeFile(join(root, 'shared/memory-contract.ts'), 'export const version = 1\r\n')
  await writeFile(join(root, 'shared/context-memory-contract.ts'), 'export const contextVersion = 2\n')
  await syncShared(root)
  const generated = join(root, 'src/shared/generated/memory-contract.ts')
  const first = await readFile(generated, 'utf8')
  assert.ok(first.endsWith('export const version = 1\n'))
  await writeFile(generated, first.replace(/\n/g, '\r\n'))
  await syncShared(root, { check: true })
  await writeFile(join(root, 'shared/memory-contract.ts'), 'export const version = 2\n')
  await assert.rejects(syncShared(root, { check: true }), /Shared source is stale/)
  assert.equal(await readFile(generated, 'utf8'), first.replace(/\n/g, '\r\n'))
  await syncShared(root)
  assert.ok((await readFile(generated, 'utf8')).endsWith('export const version = 2\n'))
  await syncShared(root, { check: true })
})

test('package validation checks the real tarball file list and rejects missing exports or escaping imports', async t => {
  const root = await mkdtemp(join(tmpdir(), 'prompt-enhance-package-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  for (const name of ['package.json', 'package-lock.json', 'lib', 'docs', 'README.md', 'README.en.md', 'LICENSE', 'cordis.patch.yml', 'shared']) {
    await cp(join(repository, name), join(root, name), { recursive: true })
  }
  await syncShared(root)
  const entry = pathToFileURL(join(root, 'scripts/check-package.mjs')).href
  await checkPackage(entry)
  const exported = join(root, 'lib/typert.host.js')
  const original = await readFile(exported, 'utf8')
  await rm(exported)
  await assert.rejects(checkPackage(entry), /Missing export: .\/lib\/typert.host.js/)
  await writeFile(exported, original + '\nimport "../../outside.js"\n')
  await assert.rejects(checkPackage(entry), /Unpacked relative import/)
  await writeFile(exported, original)
  await rm(join(root, 'docs/screenshots/enhance-preview.png'))
  await assert.rejects(checkPackage(entry), /Missing docs\/screenshots\/enhance-preview.png/)
})

test('formal release versions reject compatibility suffixes and mismatched locks before packaging', async t => {
  const root = await mkdtemp(join(tmpdir(), 'prompt-improver-version-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const manifest = { name: 'dsh-prompt-improver', version: '0.2.11', devDependencies: { example: '1.0.0' } }
  const lock = { version: manifest.version, packages: { '': { version: manifest.version } } }
  const entry = pathToFileURL(join(root, 'scripts/check-package.mjs')).href
  await writeFile(join(root, 'package-lock.json'), JSON.stringify(lock))
  await checkFormalReleaseVersion(root, manifest)
  for (const version of ['0.2.11+dsh.rc45.1', '0.2', 'v0.2.11', '0.02.11']) {
    await writeFile(join(root, 'package.json'), JSON.stringify({ ...manifest, version }))
    await assert.rejects(checkPackage(entry), /Formal release version/)
  }
  await writeFile(join(root, 'package.json'), JSON.stringify(manifest))
  for (const mismatched of [
    { ...lock, version: '0.2.10' },
    { ...lock, packages: { '': { version: '0.2.10' } } },
  ]) {
    await writeFile(join(root, 'package-lock.json'), JSON.stringify(mismatched))
    await assert.rejects(checkPackage(entry), /version differs from formal release/)
  }
  await rm(join(root, 'package-lock.json'))
  await assert.rejects(checkFormalReleaseVersion(root, manifest), /requires package-lock.json/)
  await checkFormalReleaseVersion(root, { version: '0.1.0' })
  for (const version of ['0.2.12-rc.1', '0.2.12-rc.1+dsh.rc45.1']) {
    await checkFormalReleaseVersion(root, { ...manifest, version })
  }
})
