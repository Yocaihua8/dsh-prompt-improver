import test from 'node:test'
import assert from 'node:assert/strict'
import { protectReferences, restoreReferences } from '../src/shared/references.js'

const draft = {
  text: '分析 @README.md 并解释',
  references: [{ source: 'file', ref: 'README.md', offset: 3, length: 10, label: 'README.md', clipboardText: '@README.md' }],
}
// The offset/length reflect clipboard text, including its @ prefix.
draft.references[0]!.length = draft.references[0]!.clipboardText.length

test('reference round trip retains identity and recomputes offsets', () => {
  const protectedDraft = protectReferences(draft, 'test')
  const result = restoreReferences(`请详细${protectedDraft.text}。`, protectedDraft)
  assert.equal(result.text, '请详细分析 @README.md 并解释。')
  assert.deepEqual(result.references, [{ ...draft.references[0], offset: 6 }])
  assert.deepEqual(draft.references[0]?.offset, 3)
})

test('missing, duplicated and invented reference tokens cannot overwrite a draft', () => {
  const protectedDraft = protectReferences(draft, 'test')
  for (const result of ['', '没有引用', protectedDraft.text + protectedDraft.tokens[0], protectedDraft.text + '⟦DSH_REF_invented_0⟧']) {
    assert.throws(() => restoreReferences(result, protectedDraft))
  }
})

test('reordered references retain their individual identities', () => {
  const value = protectReferences({ text: '@a @b', references: [
    { source: 'file', ref: 'a', offset: 0, length: 2, label: 'a', clipboardText: '@a' },
    { source: 'file', ref: 'b', offset: 3, length: 2, label: 'b', clipboardText: '@b' },
  ] }, 'two')
  const result = restoreReferences(`${value.tokens[1]}，再${value.tokens[0]}`, value)
  assert.equal(result.text, '@b，再@a')
  assert.deepEqual(result.references.map(ref => [ref.ref, ref.offset]), [['b', 0], ['a', 4]])
})

test('malformed reference offsets fail before any request', () => {
  assert.throws(() => protectReferences({ ...draft, references: [{ ...draft.references[0]!, offset: 4 }] }, 'test'))
})
