import test from 'node:test'
import assert from 'node:assert/strict'
import { diffTexts } from '../src/client/diff.js'

test('identical texts produce no markers', () => {
  const result = diffTexts('同一段草稿', '同一段草稿')
  assert.deepEqual(result, {
    original: [{ text: '同一段草稿', kind: 'same' }],
    enhanced: [{ text: '同一段草稿', kind: 'same' }],
    added: 0, removed: 0,
  })
})

test('word-level insertion keeps shared words unmarked and rebuilds both sides', () => {
  const result = diffTexts('请解释闭包的概念', '请用例子解释闭包的概念')
  assert.ok(result.added > 0 && result.added <= '请用例子'.length)
  // Word segmentation may re-cut one boundary word (e.g. 请用); changes stay tiny.
  assert.ok(result.removed <= 2)
  assert.ok(result.enhanced.some(segment => segment.kind === 'add'))
  assert.ok(result.enhanced.every(segment => segment.kind !== 'del'))
  assert.ok(result.original.every(segment => segment.kind !== 'add'))
  assert.equal(result.original.map(segment => segment.text).join(''), '请解释闭包的概念')
  assert.equal(result.enhanced.map(segment => segment.text).join(''), '请用例子解释闭包的概念')
})

test('multi-line replacement pairs changed lines, preserves boundaries and counts additions', () => {
  const a = '第一段\n第二段开始\n第三段', b = '第一段\n第二段开始了，补充一句\n第三段修改'
  const result = diffTexts(a, b)
  assert.equal(result.original.map(segment => segment.text).join(''), a)
  assert.equal(result.enhanced.map(segment => segment.text).join(''), b)
  assert.ok(result.added >= '了，补充一句'.length)
  assert.equal(result.removed, 0)
  assert.ok(result.enhanced.some(segment => segment.kind === 'add'))
  assert.ok(result.original.every(segment => segment.kind !== 'del'))
})

test('line deletion and insertion mark whole lines without breaking rebuilds', () => {
  const a = '保留\n被删除的行\n结尾', b = '保留\n新增的行\n结尾'
  const result = diffTexts(a, b)
  assert.equal(result.original.map(segment => segment.text).join(''), a)
  assert.equal(result.enhanced.map(segment => segment.text).join(''), b)
  assert.ok(result.removed > 0 && result.added > 0)
})

test('oversized token tables fall back to whole-block markers instead of hanging', () => {
  const a = Array.from({ length: 700 }, (_, index) => `词${index}`).join(' ')
  const b = Array.from({ length: 700 }, (_, index) => `词${index + 1}`).join(' ')
  const result = diffTexts(a, b)
  assert.equal(result.original.map(segment => segment.text).join(''), a)
  assert.equal(result.enhanced.map(segment => segment.text).join(''), b)
  assert.ok(result.added > 0 && result.removed > 0)
  assert.ok(result.enhanced.some(segment => segment.text.length > 1000))
})
