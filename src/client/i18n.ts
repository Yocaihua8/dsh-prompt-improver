import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { useSyncExternalStore } from 'react'
import { zh, en, interpolate, describeMessage, type Args, type MessageKey, type UiMessage, type MessageParams } from '../shared/messages.js'
export { m } from '../shared/messages.js'
declare module '@deepseek-ai/dsh-client-ui-slots' { interface LocaleNamespaceMap { 'dsh-prompt-improver': MessageKey } }
let runtime: Context['locale'] | undefined
let translate: ((key: MessageKey, params?: MessageParams) => string) | undefined
let fallback: 'zh' | 'en' = 'zh'
const listeners = new Set<() => void>()
const notify = () => { for (const listener of listeners) listener() }
export const subscribeLocale = (listener: () => void): (() => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
export const localeId = (): string => runtime?.getSnapshot().active ?? fallback
export const formatLocale = (): string => localeId().startsWith('zh') ? 'zh-CN' : 'en-US'
export function useLocale(): string { return useSyncExternalStore(subscribeLocale, localeId, localeId) }
/** Native locale subscriptions only repaint; they never touch business controllers or requests. */
export function installLocale(ctx: Context): void {
 const dispose = ctx.locale.register('dsh-prompt-improver', { zh, en })
 runtime = ctx.locale; translate = ctx.locale.bind('dsh-prompt-improver')
 const stop = runtime.subscribe(notify)
 ctx.effect(() => () => { stop(); dispose(); if (runtime === ctx.locale) { runtime = undefined; translate = undefined }; notify() })
}
export function t<K extends MessageKey>(key: K, ...[params]: Args<K>): string {
 let value = translate ? translate(key, params) : interpolate(localeId().startsWith('zh') ? zh[key] : en[key], params)
 if (!localeId().startsWith('zh') && params && Number(String((params as MessageParams).p0).replaceAll(',', '')) === 1) value = value.replace(/\b(model calls|calls|tools|items|conversations|days)\b/, word => word.slice(0,-1))
 return value
}
export function localize(message: string, descriptor?: UiMessage, depth = 0): string {
 const info = descriptor ?? describeMessage(message) ?? describeMessage(message.trim())
 if (!info || !(info.messageKey in zh)) return message
 const params = Object.fromEntries(Object.entries(info.messageParams ?? {}).map(([key,value])=>[key, depth < 3 && typeof value === 'string' ? localize(value, undefined, depth + 1) : value]))
 const result = t(info.messageKey, params as never)
 return message !== message.trim() ? message.match(/^\s*/)?.[0] + result + (message.match(/\s*$/)?.[0] ?? '') : result
}
export function diagnostic(message: string, descriptor?: UiMessage): string {
 if (!message) return ''
 return descriptor || describeMessage(message) ? localize(message, descriptor) : t('m162', { p0: message })
}
/** Isolated component tests use the same dictionaries without persisting host preferences. */
export function setTestLocale(locale: 'zh' | 'en'): void { fallback = locale; notify() }
export function dateLabel(value: string): string {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
 return new Intl.DateTimeFormat(formatLocale(), { year:'numeric', month:'short', day:'numeric', timeZone:'UTC' }).format(new Date(value + 'T00:00:00Z'))
}
export function unit(count: number | null, singular: string, plural = singular + 's'): string { return count === 1 ? singular : plural }

export function sourceLabel(source: { kind: string; label: string; labelMessage?: UiMessage }): string {
 if (source.labelMessage) return localize(source.label, source.labelMessage)
 if (source.kind === 'conversation') return source.label.replace(/ · (用户|助手)$/, (_, role: string) => ' · ' + localize(role))
 if (source.kind === 'memory') return source.label.replace(/^(个人|项目) · /, (_, scope: string) => localize(scope) + ' · ')
 return source.label
}
