import { lstat, open, realpath } from 'node:fs/promises'
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-subprocess'
import type { ContextReport, ContextSource } from '../shared/types.js'

const TEXT = new Set(['.md', '.txt', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.yaml', '.yml', '.toml', '.py', '.rs', '.go', '.java', '.cs', '.cpp', '.h', '.css', '.html', '.vue', '.svelte', '.sql', '.sh', '.ps1'])
const EXCLUDED = /(?:^|[/\\])(?:\.[^/\\]+|node_modules|vendor|target|dist|build|out|output|coverage|cache|__pycache__|venv|env|credentials?[^/\\]*|secrets?[^/\\]*|tokens?[^/\\]*|id_rsa|id_ed25519)(?:[/\\]|$)|(?:^|[/\\])[^/\\]*(?:password|credential|secret|token|lock)[^/\\]*$|\.(?:pem|key|pfx|p12|crt|cer|keystore)$/i
export function allowedProjectFile(path: string): boolean {
  return !isAbsolute(path) && !path.split(/[/\\]/).includes('..') && !EXCLUDED.test(path) && TEXT.has(extname(path).toLowerCase())
}
export function searchTerms(draft: string): string[] {
  const clean = draft.replace(/⟦DSH_REF_[^⟧]+⟧/gu, '')
  const identifiers = clean.match(/[\p{L}_][\p{L}\p{N}_./\\-]{1,100}/gu) ?? []
  const words = [...new Intl.Segmenter('zh', { granularity: 'word' }).segment(clean)]
    .filter(part => part.isWordLike && part.segment.length > 1).map(part => part.segment)
  const stop = new Set(['请帮', '帮我', '这个', '进行', '需要', 'please', 'with', 'that', 'this', 'the'])
  return [...new Set([...identifiers, ...words].map(word => word.toLowerCase()))].filter(word => !stop.has(word)).slice(0, 24)
}
export async function safeFile(root: string, path: string): Promise<string | null> {
  if (!allowedProjectFile(path)) return null
  const absolute = resolve(root, path)
  const rel = relative(root, absolute)
  if (rel.startsWith('..') || isAbsolute(rel)) return null
  // Reject every link/junction, including those that currently point inside the project.
  let current = root
  for (const component of rel.split(sep)) {
    current = join(current, component)
    if ((await lstat(current)).isSymbolicLink()) return null
  }
  const canonical = await realpath(absolute)
  const canonicalRelative = relative(root, canonical)
  if (canonicalRelative.startsWith('..') || isAbsolute(canonicalRelative)) return null
  return canonical
}

/** Bounded lexical retrieval, with no shell, model call, index or workspace argument from the client. */
export async function searchProject(ctx: Pick<Context, 'subprocess'>, root: string, draft: string, caller: AbortSignal): Promise<ContextReport> {
  const sources: ContextSource[] = [], warnings: string[] = []
  const terms = searchTerms(draft)
  if (!terms.length) return { sources, warnings }
  const timeout = AbortSignal.timeout(5000)
  const signal = AbortSignal.any([caller, timeout])
  try {
    const { rgPath } = await import('@vscode/ripgrep')
    const handle = ctx.subprocess.spawn({
      argv: [rgPath.replace(/\.asar(?=[\\/])/u, '.asar.unpacked'), '--no-config', '--files', '--null', '--no-follow', '--', '.'],
      cwd: root, signal, graceMs: 500,
      stdio: { stdin: 'ignore', stdout: { maxBytes: 512_000 }, stderr: { maxBytes: 1024 } },
    })
    const outcome = await handle.done
    signal.throwIfAborted()
    const output = handle.collected.stdout?.readFrom(0)
    if (!output || outcome.signal !== null || ![0, 1].includes(outcome.exitCode ?? -1)) throw new Error('search-failed')
    if (output.lossy) { warnings.push('项目文件列表超出检索上限，未采用不完整列表。'); return { sources, warnings } }
    const paths = output.text.split('\0').filter(Boolean).map(path => path.replace(/^\.\//, '').replace(/^\.\\/, ''))
      .filter(allowedProjectFile).map(path => ({ path, rank: terms.filter(term => path.toLowerCase().includes(term)).length }))
      .sort((a, b) => b.rank - a.rank || a.path.localeCompare(b.path))
    if (paths.length > 300) warnings.push('项目检索限定为按路径相关性排序的前 300 个文本文件，结果可能不完整。')
    const candidates: { source: ContextSource; score: number }[] = []
    for (const { path, rank } of paths.slice(0, 300)) {
      signal.throwIfAborted()
      try {
        const file = await safeFile(root, path)
        if (!file) continue
        const fd = await open(file, 'r')
        let content: string
        try {
          const stat = await fd.stat()
          if (!stat.isFile()) continue
          if (stat.size > 128_000) { warnings.push('部分项目文件超过 128 KB，已跳过。'); continue }
          const buffer = Buffer.alloc(stat.size)
          const { bytesRead } = await fd.read(buffer, 0, buffer.length, 0)
          content = buffer.subarray(0, bytesRead).toString('utf8')
        } finally { await fd.close() }
        if (content.includes('\0')) continue
        const lines = content.split(/\r?\n/)
        const hits = lines.map((line, index) => ({ index, score: terms.filter(term => line.toLowerCase().includes(term)).length }))
          .filter(hit => hit.score).sort((a, b) => b.score - a.score || a.index - b.index)
        if (!rank && !hits.length) continue
        const indexes = new Set<number>()
        for (const hit of hits.length ? hits.slice(0, 3) : [{ index: 0 }]) {
          for (let i = Math.max(0, hit.index - 1); i <= Math.min(lines.length - 1, hit.index + 2); i++) indexes.add(i)
        }
        // Omit credential-looking lines even in otherwise ordinary source files.
        const text = [...indexes].sort((a, b) => a - b).map(i => `${i + 1}: ${lines[i]}`)
          .filter(line => !/(?:api[_-]?key|secret|password|authorization|access[_-]?token)\s*[=:]|BEGIN .*PRIVATE KEY/i.test(line)).join('\n')
        if (text) candidates.push({ source: { kind: 'project', label: path, text }, score: rank * 5 + hits.reduce((sum, hit) => sum + hit.score, 0) })
      } catch { signal.throwIfAborted(); warnings.push('部分项目文件读取失败，未纳入上下文。') }
    }
    let remaining = 4000
    const ranked = candidates.sort((a, b) => b.score - a.score || a.source.label.localeCompare(b.source.label))
    for (const { source } of ranked.slice(0, 5)) {
      const limit = Math.min(1000, remaining)
      if (!limit) break
      const text = source.text.length > limit ? source.text.slice(0, limit - 10) + '\n[片段已截断]' : source.text
      if (text !== source.text) warnings.push('项目片段已按预算截断。')
      sources.push({ ...source, text }); remaining -= text.length
    }
    if (ranked.length > sources.length) warnings.push('项目检索仅采用相关性最高的至多 5 个文件片段。')
  } catch {
    caller.throwIfAborted()
    warnings.push(timeout.aborted ? '项目检索超时，未采用项目片段。' : '项目检索失败，未采用项目片段。')
    sources.length = 0
  }
  return { sources, warnings: [...new Set(warnings)] }
}
