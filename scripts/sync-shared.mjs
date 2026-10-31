import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const pluginRoot = fileURLToPath(new URL('../', import.meta.url))
const generatedHeader = '// Generated from shared/ by scripts/sync-shared.mjs. Edit the shared source.\n'

/** Keep the contract inside rootDir for TypeScript and the Typert staging workspace. */
export async function syncShared(root = pluginRoot, { check = false } = {}) {
  for (const name of ['memory-contract.ts', 'context-memory-contract.ts']) {
    const source = await readFile(join(root, 'shared', name), 'utf8')
    const expected = generatedHeader + source.replace(/\r\n/g, '\n')
    const target = join(root, 'src/shared/generated', name)
    let existing
    try { existing = await readFile(target, 'utf8') }
    catch (error) { if (error.code !== 'ENOENT') throw error }
    if (existing?.replace(/\r\n/g, '\n') === expected) continue
    if (check) throw new Error(`Shared source is stale: src/shared/generated/${name}. Run npm run sync:shared.`)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, expected, 'utf8')
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await syncShared(undefined, { check: process.argv.includes('--check') })
}
