/** The public semantic reference fields from DSH's draft snapshot. */
export interface DraftReference {
  source: string
  ref: string
  offset: number
  length: number
  label: string
  clipboardText: string
  appearance?: 'file' | 'folder' | 'session' | 'skill' | string
  invalid?: boolean
}

export interface SemanticDraft {
  text: string
  references: DraftReference[]
}

export interface ProtectedDraft {
  text: string
  tokens: string[]
  references: DraftReference[]
}

export function protectReferences(draft: SemanticDraft, nonce: string): ProtectedDraft {
  if (!/^[a-zA-Z0-9-]+$/.test(nonce)) throw new Error('无效的引用保护标识。')
  const prefix = `⟦DSH_REF_${nonce}_`
  if (draft.text.includes(prefix)) throw new Error('引用保护标识与原文冲突，请重试。')
  let end = 0
  const pieces: string[] = []
  const tokens: string[] = []
  for (const [index, reference] of draft.references.entries()) {
    if (!Number.isInteger(reference.offset) || reference.offset < end ||
        reference.length !== reference.clipboardText.length || reference.length <= 0 ||
        draft.text.slice(reference.offset, reference.offset + reference.length) !== reference.clipboardText) {
      throw new Error('草稿引用状态已变化，请重试。')
    }
    const token = `${prefix}${index}⟧`
    pieces.push(draft.text.slice(end, reference.offset), token)
    tokens.push(token)
    end = reference.offset + reference.length
  }
  pieces.push(draft.text.slice(end))
  return { text: pieces.join(''), tokens, references: draft.references.map(ref => ({ ...ref })) }
}

export function validateTokens(text: string, tokens: readonly string[]): void {
  const actual = text.match(/⟦DSH_REF_[^⟧\r\n]+⟧/gu) ?? []
  if (actual.length !== tokens.length || new Set(tokens).size !== tokens.length ||
      actual.some(token => !tokens.includes(token)) ||
      tokens.some(token => text.split(token).length !== 2)) {
    throw new Error('增强结果未完整保留引用，已保留原文。')
  }
}

export function restoreReferences(text: string, protectedDraft: ProtectedDraft): SemanticDraft {
  validateTokens(text, protectedDraft.tokens)
  const ordered = protectedDraft.tokens.map((token, index) => ({
    token, index, offset: text.indexOf(token),
  })).sort((a, b) => a.offset - b.offset)
  const references: DraftReference[] = []
  let cursor = 0
  let output = ''
  for (const item of ordered) {
    const reference = protectedDraft.references[item.index]!
    output += text.slice(cursor, item.offset)
    references.push({ ...reference, offset: output.length })
    output += reference.clipboardText
    cursor = item.offset + item.token.length
  }
  output += text.slice(cursor)
  return { text: output, references }
}
