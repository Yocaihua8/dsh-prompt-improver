import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import { installProxyFromEnvironment, proxyRouteFor } from '@deepseek-ai/dsh-http-proxy'

const require = createRequire(import.meta.url)

test('Zod resolved by the rc.3 registry rejects oversized arrays before parsing their elements', () => {
  const registryRequire = createRequire(require.resolve('@deepseek-ai/dsh-typert-registry'))
  const { z } = registryRequire('zod') as typeof import('zod')
  let parsed = 0
  const schema = z.array(z.preprocess(value => { parsed++; return value }, z.number())).max(2)
  assert.deepEqual(schema.parse([1, 2]), [1, 2])
  assert.equal(parsed, 2)
  parsed = 0
  const result = schema.safeParse(Array(1000).fill('invalid'))
  assert.equal(result.success, false)
  assert.equal(parsed, 0)
  assert.equal(result.error!.issues.length, 1)
  assert.equal(result.error!.issues[0]!.code, 'too_big')
})

test('rc.3 HTTP proxy works with patched Undici and rejects uppercase integrity mismatches', async t => {
  const proxyRequire = createRequire(require.resolve('@deepseek-ai/dsh-http-proxy'))
  const { fetch, getGlobalDispatcher } = proxyRequire('undici') as typeof import('undici')
  const previousDispatcher = getGlobalDispatcher()
  const server = createServer((_request, response) => response.end('compatibility-check'))
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  })
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`
  const diagnostics: string[] = []
  const dispose = await installProxyFromEnvironment({
    get: name => name === 'HTTP_PROXY' ? { value: 'http://127.0.0.1:9' } : undefined,
  }, message => diagnostics.push(message))
  try {
    assert.deepEqual(diagnostics, [])
    assert.equal(proxyRouteFor(new URL(url)).proxied, false)
    assert.equal(proxyRouteFor(new URL('http://example.invalid/')).proxied, true)
    assert.equal(await (await fetch(url, { signal: AbortSignal.timeout(5000) })).text(), 'compatibility-check')
    await assert.rejects(fetch(url, {
      integrity: `SHA256-${Buffer.alloc(32).toString('base64')}`,
      signal: AbortSignal.timeout(5000),
    }), /fetch failed/)
  } finally {
    await dispose()
  }
  assert.equal(getGlobalDispatcher(), previousDispatcher)
})
