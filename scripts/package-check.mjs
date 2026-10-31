import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve, sep } from 'node:path'
import assert from 'node:assert/strict'
import { syncShared } from './sync-shared.mjs'

/** Kept local so a standalone clone has the same formal-release checks. */
export async function checkFormalReleaseVersion(root, manifest) {
  if (typeof manifest.version === 'string' && /^\d+\.\d+\.\d+-/.test(manifest.version)) return
  assert.match(manifest.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, 'Formal release version must use X.Y.Z without suffixes')
  let lock
  try { lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8')) }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
    assert.equal(Object.keys({ ...manifest.dependencies, ...manifest.devDependencies }).length, 0, 'Formal release with dependencies requires package-lock.json')
    return
  }
  assert.equal(lock.version, manifest.version, 'Lockfile version differs from formal release')
  assert.equal(lock.packages?.['']?.version, manifest.version, 'Root lockfile package version differs from formal release')
}

/** Check the actual tarball allowlist without overwriting any existing archive. */
export async function checkPackage(entryUrl) {
  const root = fileURLToPath(new URL('../', entryUrl))
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  await checkFormalReleaseVersion(root, manifest)
  await syncShared(root, { check: true })
  if (!process.env.npm_execpath) throw new Error('Run through npm run check:package')
  const [pack] = JSON.parse(execFileSync(process.execPath, [process.env.npm_execpath, 'pack', '--dry-run', '--ignore-scripts', '--json'], { cwd: root, encoding: 'utf8' }))
  const files = new Set(pack.files.map(entry => entry.path))
  for (const target of Object.values(manifest.exports)) {
    for (const path of typeof target === 'string' ? [target] : Object.values(target)) {
      const relative = path.replace(/^\.\//, '')
      if (relative.includes('*')) {
        const pattern = new RegExp(`^${relative.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`)
        assert.ok([...files].some(file => pattern.test(file)), `Missing export: ${path}`)
      } else assert.ok(files.has(relative), `Missing export: ${path}`)
    }
  }
  for (const required of ['README.md', 'README.en.md', 'LICENSE', 'cordis.patch.yml', 'docs/verification.md',
    'docs/guide.md', 'docs/development.md', 'docs/guide.en.md', 'docs/development.en.md',
    'docs/verification.en.md', 'docs/screenshots/README.md',
    'docs/screenshots/enhance-entry.png', 'docs/screenshots/enhance-preview.png', 'docs/screenshots/enhance-settings.png']) {
    assert.ok(files.has(required), `Missing ${required}`)
  }
  for (const path of files) {
    assert.ok(!/^(?:src|test|scripts|shared|node_modules|\.cache|output|\.playwright-cli)\//.test(path), `Unexpected package source/cache: ${path}`)
    assert.ok(!/(?:^|\/)(?:\.env|\.credentials|auth\.json)/.test(path), `Unexpected private config: ${path}`)
    if (!/\.(?:js|mjs|d\.ts)$/.test(path)) continue
    const source = await readFile(join(root, path), 'utf8')
    for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s*)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const target = resolve(root, dirname(path), match[1])
      // Runtime and declaration relative imports must remain inside the published package.
      const local = relative(root, target)
      const packed = local.replaceAll('\\', '/')
      assert.ok(local !== '..' && !local.startsWith(`..${sep}`)
        && (files.has(packed) || path.endsWith('.d.ts') && files.has(packed.replace(/(?<!\.d)\.[jt]s$/, '.d.ts'))), `Unpacked relative import: ${path} -> ${match[1]}`)
    }
  }
  assert.equal(manifest.engines.dsh, '0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5')
  console.log(`${manifest.name}: package verified (${files.size} files, ${pack.unpackedSize} unpacked bytes).`)
}
