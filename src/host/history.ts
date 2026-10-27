import { HISTORY_CHAR_LIMIT, HISTORY_TURN_LIMIT } from '../shared/types.js'
import type { ContextMessage } from './prompt.js'

export interface HistoryEvent { seq: number; type: string; data: unknown }

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function visibleText(content: unknown): string {
  if (!Array.isArray(content)) return ''
  return content.flatMap(block => {
    const value = record(block)
    return value.type === 'text' && typeof value.text === 'string' ? [value.text] : []
  }).join('\n')
}

/** Use the current surface for content, raw lifecycle events only for turn membership. */
export function recentConversation(
  surface: readonly HistoryEvent[], raw: readonly HistoryEvent[], capturedThroughSeq: number | null,
  charLimit = HISTORY_CHAR_LIMIT,
): ContextMessage[] {
  const cutoff = capturedThroughSeq ?? -1
  const memberships = new Map<number, number>()
  const completed: number[] = []
  let activeTurn: number | undefined
  for (const event of raw) {
    if (event.seq > cutoff) break
    const data = record(event.data)
    if (event.type === 'turn/start' && typeof data.turn === 'number') activeTurn = data.turn
    if (activeTurn !== undefined) memberships.set(event.seq, activeTurn)
    if (event.type === 'turn/end') {
      if (typeof data.turn === 'number' && record(data.reason).kind === 'completed') completed.push(data.turn)
      activeTurn = undefined
    }
  }
  const allowed = new Set(completed)
  const grouped = new Map<number, ContextMessage[]>()
  for (const event of surface) {
    const data = record(event.data)
    const turn = typeof data.turn === 'number' ? data.turn : memberships.get(event.seq)
    if (turn === undefined || !allowed.has(turn)) continue
    let message: ContextMessage | undefined
    if (event.type === 'user/message' && record(data.source).kind === 'user') {
      message = { role: 'user', text: visibleText(data.content) }
    } else if (event.type === 'assistant/message' && data.interrupted !== true) {
      message = { role: 'assistant', text: visibleText(record(data.message).content) }
    }
    if (!message?.text.trim()) continue
    const messages = grouped.get(turn) ?? []
    messages.push(message)
    grouped.set(turn, messages)
  }
  const turns = completed.filter(turn => {
    const messages = grouped.get(turn)
    return messages?.some(m => m.role === 'user') && messages.some(m => m.role === 'assistant')
  }).slice(-HISTORY_TURN_LIMIT)
  const retained: ContextMessage[] = []
  let remaining = Math.max(0, charLimit)
  for (const turn of turns.toReversed()) {
    const messages = grouped.get(turn)!
    const user = messages.filter(m => m.role === 'user').map(m => m.text).join('\n')
    const assistant = messages.filter(m => m.role === 'assistant').map(m => m.text).join('\n')
    if (user.length + assistant.length <= remaining) {
      retained.unshift({ role: 'user', text: user }, { role: 'assistant', text: assistant })
      remaining -= user.length + assistant.length
    } else if (!retained.length && remaining >= 32) {
      // Keep the latest user's requirements first; never retain an orphan answer.
      const clip = (text: string, limit: number) => text.length <= limit ? text : text.slice(0, Math.max(0, limit - 8)).replace(/[\uD800-\uDBFF]$/u, '') + '[内容已截断]'
      const userText = clip(user, Math.max(16, remaining - 16))
      const assistantText = clip(assistant, remaining - userText.length)
      retained.unshift({ role: 'user', text: userText }, { role: 'assistant', text: assistantText })
      break
    } else break
  }
  return retained
}
