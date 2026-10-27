import { test } from 'node:test'
import assert from 'node:assert/strict'
import { recentConversation } from '../src/host/history.js'
import type { HistoryEvent } from '../src/host/history.js'

function history() {
  const events: HistoryEvent[] = []
  const add = (type: string, data: unknown) => events.push({ seq: events.length + 1, type, data })
  for (let turn = 1; turn <= 5; turn++) {
    add('turn/start', { turn })
    add('user/message', { source: { kind: 'user' }, content: [{ type: 'text', text: `问题${turn}` }, { type: 'file', text: 'secret attachment' }] })
    add('user/message', { source: { kind: 'runtime-context' }, content: [{ type: 'text', text: 'secret runtime' }] })
    add('assistant/message', { turn, message: { content: [{ type: 'text', text: `回答${turn}` }, { type: 'reasoning', text: 'secret reasoning' }] } })
    add('tool/result', { turn, text: 'secret tool' })
    if (turn < 5) add('turn/end', { turn, reason: { kind: turn === 3 ? 'aborted' : 'completed' } })
  }
  return events
}

test('history selects only three completed human/assistant rounds and excludes non-text content', () => {
  const events = history()
  assert.deepEqual(recentConversation(events, events, events.length).map(m => m.text), ['问题1', '回答1', '问题2', '回答2', '问题4', '回答4'])
  assert.equal(JSON.stringify(recentConversation(events, events, events.length)).includes('secret'), false)
})

test('uses current surface content, capture fence, and the newest three rounds', () => {
  const events = history()
  events.push({ seq: events.length + 1, type: 'turn/end', data: { turn: 5, reason: { kind: 'completed' } } })
  assert.deepEqual(recentConversation(events, events, events.length).map(m => m.text), ['问题2', '回答2', '问题4', '回答4', '问题5', '回答5'])
  const surface = events.filter(event => event.type !== 'assistant/message' || (event.data as { turn: number }).turn !== 4)
  assert.equal(recentConversation(surface, events, events.length).some(m => m.text === '回答4'), false)
  assert.equal(recentConversation(events, events, events.length - 1).some(m => m.text === '回答5'), false)
  assert.deepEqual(recentConversation(events, events, null), [])
})

test('history caps at 12000 characters, preserves paired user requirements and does not split emoji', () => {
  const events = history()
  const assistant = events.find(event => event.type === 'assistant/message' && (event.data as { turn: number }).turn === 4)!
  assistant.data = { turn: 4, message: { content: [{ type: 'text', text: '旧'.repeat(15000) + '最新内容' }] } }
  const result = recentConversation(events, events, events.length)
  assert.equal(result.length, 2)
  assert.equal(result[0]!.role, 'user')
  assert.equal(result[0]!.text, '问题4')
  assert.ok(result.reduce((sum, item) => sum + item.text.length, 0) <= 12000)
  assert.ok(result[1]!.text.includes('已截断'))
  assistant.data = { turn: 4, message: { content: [{ type: 'text', text: '旧'.repeat(30) + '😀尾' }] } }
  assert.deepEqual(recentConversation(events, events, events.length, 10), [])
  for (const item of recentConversation(events, events, events.length, 35)) assert.equal(item.text.isWellFormed(), true)
})
