// Read-only extraction of installed DSH web assets. Run with ELECTRON_RUN_AS_NODE=1.
// Nothing is written to the application, its profiles, or DSH_HOME.
const fs = require('node:fs')
const path = require('node:path')
const [resources, destination] = process.argv.slice(2)
if (!resources || !destination) throw new Error('Usage: extract-host.cjs <DSH resources> <test assets directory>')
const packages = path.join(resources, 'app.asar/dsh/node_modules/@deepseek-ai')
const frontend = path.join(packages, 'dsh-web-frontend')
const version = JSON.parse(fs.readFileSync(path.join(frontend, 'package.json'), 'utf8')).version
if (version !== '0.2.1-rc.3') throw new Error(`Recheck UI fixture extraction for DSH ${version}`)
const assets = path.join(frontend, 'dist/assets')
fs.mkdirSync(destination, { recursive: true })
const entries = fs.readdirSync(assets).filter(name => /^(index|vendor)-.*\.(js|css)$/.test(name))
for (const name of entries) fs.copyFileSync(path.join(assets, name), path.join(destination, name))
const main = entries.find(name => /^index-.*\.js$/.test(name))
const source = fs.readFileSync(path.join(assets, main), 'utf8')
const modules = /function (\w+)\(\)\{return\{react:/.exec(source)?.[1]
const boot = source.search(/const \w+=globalThis\.dshDesktopBoot,/)
if (!modules || boot < 0) throw new Error('DSH web entry changed; cannot isolate its static UI modules')
// Keep the shipped modules intact; omit only the app boot that connects to a Host.
fs.writeFileSync(path.join(destination, 'modules.js'), `${source.slice(0, boot)}\nexport { ${modules} as createHostModules };\n`)
const theme = fs.readFileSync(path.join(packages, 'dsh-client-ui-theme/lib/client.js'), 'utf8')
const css = [...theme.matchAll(/var \w+_css_default = ("(?:\\.|[^"\\])*");/g)].map(match => JSON.parse(match[1])).join('\n')
if (!css.includes('--dsw-alias-bg-base')) throw new Error('DSH theme tokens missing')
fs.writeFileSync(path.join(destination, 'theme.css'), css)
fs.writeFileSync(path.join(destination, 'assets.json'), JSON.stringify({ version, styles: [...entries.filter(name => name.endsWith('.css')), 'theme.css'] }, null, 2))
// Test-only export of the shipped composer, shell and keymap; production assets remain untouched.
const conversation = fs.readFileSync(path.join(packages, 'dsh-client-ui-conversation/lib/client.js'), 'utf8')
for (const marker of ['var SessionInputShell = class', 'function DraftEditor(', 'function registerComposerKeymap(', 'InputBar_module_css_default =']) {
  if (!conversation.includes(marker)) throw new Error(`Recheck native composer fixture: ${marker}`)
}
fs.writeFileSync(path.join(destination, 'native-composer.js'), conversation.replace('return module.exports;',
  'exports.predictionFixture = { SessionInputShell, DraftEditor, registerComposerKeymap, css: InputBar_module_css_default, style: css$1 }; return module.exports;'))
console.log(`Extracted DSH ${version} static UI modules and theme into ${destination}`)
