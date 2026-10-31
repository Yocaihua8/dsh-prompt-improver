import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const assets = resolve(process.argv[2] ?? '../output/prompt-enhance-ui-20261025/browser/host')
const port = Number(process.argv[3] ?? 8768)
const manifest = JSON.parse(await readFile(resolve(assets, 'assets.json'), 'utf8'))
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Prompt Enhance 正式组件验收</title>${manifest.styles.map(name => `<link rel="stylesheet" href="/host/${name}">`).join('')}<link rel="stylesheet" href="/fixture.css"></head><body><div id="root"></div><script type="module" src="/ui-fixture.js"></script></body></html>`
const files = new Map([
  ['/locale-fixture.js', resolve(root, 'test/browser/locale-fixture.js')],
  ['/personal.js', resolve(root, '../dsh-personal-center/lib/client.js')],
  ['/personal-fixture.js', resolve(root, '../dsh-personal-center/test/browser/personal-fixture.js')],
  ['/client.js', resolve(root, 'lib/client.js')],
  ['/ui-fixture.js', resolve(root, 'test/browser/ui-fixture.js')],
  ['/single-button.js', resolve(root, 'test/browser/single-button.js')],
  ['/prediction-fixture.js', resolve(root, 'test/browser/prediction-fixture.js')],
  ['/fixture.css', resolve(root, 'test/browser/fixture.css')],
])
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }
createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, `http://127.0.0.1:${port}`).pathname
    res.setHeader('Cache-Control', 'no-store')
    // Shipped schema modules compile validators; this isolated page still blocks all connections.
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval'; connect-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:")
    if (pathname === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); return }
    if (pathname === '/personal') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html.replace('/ui-fixture.js', '/personal-fixture.js')); return }
    if (pathname === '/prediction') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html.replace('/ui-fixture.js', '/prediction-fixture.js')); return }
    let file = files.get(pathname)
    if (pathname.startsWith('/host/')) {
      const candidate = resolve(assets, decodeURIComponent(pathname.slice(6)))
      if (candidate.startsWith(assets + sep)) file = candidate
    }
    if (!file) { res.writeHead(404).end(); return }
    const content = await readFile(file)
    res.setHeader('Content-Type', `${mime[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream'}; charset=utf-8`)
    res.end(content)
  } catch { res.writeHead(404).end() }
}).listen(port, '127.0.0.1', () => console.log(`UI fixture only, no Host or model connection: http://127.0.0.1:${port}/`))
