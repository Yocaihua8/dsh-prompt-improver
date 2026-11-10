/** Word-level diff for the preview panes. Pure functions; no third-party dependency. */

export interface DiffSegment { text: string; kind: 'same' | 'add' | 'del' }
export interface DiffResult {
  original: DiffSegment[]
  enhanced: DiffSegment[]
  added: number
  removed: number
}

/** LCS table is bounded; larger inputs fall back to whole-block add/del. */
const CELL_LIMIT = 400_000
/** Tokenize by locale word segments; segments always concatenate back to the input. */
const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' })

function tokens(text: string): string[] {
  return [...segmenter.segment(text)].map(part => part.segment)
}

function lcsOps(a: string[], b: string[]): Array<{ kind: 'same' | 'del' | 'add'; text: string }> | null {
  const n = a.length, m = b.length
  if (n * m > CELL_LIMIT) return null
  const width = m + 1
  const table = new Uint32Array((n + 1) * width)
  for (let i = n - 1; i >= 0; i--) {
    const row = i * width, nextRow = row + width
    for (let j = m - 1; j >= 0; j--) {
      table[row + j] = a[i] === b[j] ? (table[nextRow + j + 1] ?? 0) + 1 : Math.max(table[nextRow + j] ?? 0, table[row + j + 1] ?? 0)
    }
  }
  const ops: Array<{ kind: 'same' | 'del' | 'add'; text: string }> = []
  let i = 0, j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ kind: 'same', text: a[i++]! }); j++ }
    else if ((table[(i + 1) * width + j] ?? 0) >= (table[i * width + j + 1] ?? 0)) ops.push({ kind: 'del', text: a[i++]! })
    else ops.push({ kind: 'add', text: b[j++]! })
  }
  while (i < n) ops.push({ kind: 'del', text: a[i++]! })
  while (j < m) ops.push({ kind: 'add', text: b[j++]! })
  return ops
}

function pushMerged(target: DiffSegment[], kind: DiffSegment['kind'], text: string): void {
  if (!text) return
  const last = target[target.length - 1]
  if (last && last.kind === kind) last.text += text
  else target.push({ text, kind })
}

/** Word-level diff of two short texts; returns null when the input exceeds the table bound. */
function wordSegments(a: string, b: string): { original: DiffSegment[]; enhanced: DiffSegment[] } | null {
  const ops = lcsOps(tokens(a), tokens(b))
  if (!ops) return null
  const original: DiffSegment[] = [], enhanced: DiffSegment[] = []
  for (const op of ops) {
    if (op.kind !== 'add') pushMerged(original, op.kind === 'same' ? 'same' : 'del', op.text)
    if (op.kind !== 'del') pushMerged(enhanced, op.kind === 'same' ? 'same' : 'add', op.text)
  }
  return { original, enhanced }
}

function wholeReplacement(a: string, b: string): { original: DiffSegment[]; enhanced: DiffSegment[] } {
  return { original: a ? [{ text: a, kind: 'del' }] : [], enhanced: b ? [{ text: b, kind: 'add' }] : [] }
}

/**
 * Align by lines first, then diff each paired changed line by word so highlights
 * stay readable. Newlines are re-inserted as 'same' separators between lines.
 */
export function diffTexts(a: string, b: string): DiffResult {
  if (a === b) {
    const same: DiffSegment[] = a ? [{ text: a, kind: 'same' }] : []
    return { original: same, enhanced: [...same], added: 0, removed: 0 }
  }
  const aLines = a.split('\n'), bLines = b.split('\n')
  const lineOps = lcsOps(aLines, bLines) ?? [
    ...aLines.map(text => ({ kind: 'del' as const, text })),
    ...bLines.map(text => ({ kind: 'add' as const, text })),
  ]
  const original: DiffSegment[] = [], enhanced: DiffSegment[] = []
  let originalLine = 0, enhancedLine = 0
  // Newline after each consumed line except the final line of that side.
  const newline = (side: DiffSegment[], line: number, total: number) => { if (line < total) pushMerged(side, 'same', '\n') }
  for (let index = 0; index < lineOps.length; index++) {
    const op = lineOps[index]!
    if (op.kind === 'same') {
      pushMerged(original, 'same', op.text)
      pushMerged(enhanced, 'same', op.text)
      newline(original, ++originalLine, aLines.length)
      newline(enhanced, ++enhancedLine, bLines.length)
      continue
    }
    let delEnd = index
    while (delEnd < lineOps.length && lineOps[delEnd]!.kind === 'del') delEnd++
    let addEnd = delEnd
    while (addEnd < lineOps.length && lineOps[addEnd]!.kind === 'add') addEnd++
    const dels = lineOps.slice(index, delEnd).map(item => item.text)
    const adds = lineOps.slice(delEnd, addEnd).map(item => item.text)
    const paired = Math.min(dels.length, adds.length)
    for (let pair = 0; pair < paired; pair++) {
      const fine = wordSegments(dels[pair]!, adds[pair]!)
      const coarse = fine ?? wholeReplacement(dels[pair]!, adds[pair]!)
      for (const segment of coarse.original) pushMerged(original, segment.kind, segment.text)
      newline(original, ++originalLine, aLines.length)
      for (const segment of coarse.enhanced) pushMerged(enhanced, segment.kind, segment.text)
      newline(enhanced, ++enhancedLine, bLines.length)
    }
    for (const text of dels.slice(paired)) { pushMerged(original, 'del', text); newline(original, ++originalLine, aLines.length) }
    for (const text of adds.slice(paired)) { pushMerged(enhanced, 'add', text); newline(enhanced, ++enhancedLine, bLines.length) }
    index = addEnd - 1
  }
  let added = 0, removed = 0
  for (const segment of original) if (segment.kind === 'del') removed += segment.text.length
  for (const segment of enhanced) if (segment.kind === 'add') added += segment.text.length
  return { original, enhanced, added, removed }
}
