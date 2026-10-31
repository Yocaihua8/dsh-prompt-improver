import test from 'node:test'
import assert from 'node:assert/strict'
import { zh, en, describeMessage, m, type MessageKey } from '../src/shared/messages.js'
import { t, localize, diagnostic, setTestLocale, formatLocale, dateLabel, installLocale, subscribeLocale } from '../src/client/i18n.js'
import type { Context } from '@deepseek-ai/cordis'

test('bilingual dictionary keys and interpolation parameters are identical', () => {
 assert.deepEqual(Object.keys(en), Object.keys(zh))
 for (const key of Object.keys(zh) as MessageKey[]) {
  const params = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort()
  assert.deepEqual(params(zh[key]), params(en[key]), key)
  assert.ok(en[key].trim()); assert.doesNotMatch(en[key], /[\p{Script=Han}]/u)
 }
})

test('canonical states, old responses, external diagnostics and locale formatting', () => {
 try {
  const canonical=m('m041', {p0: 2})
  setTestLocale('en')
  assert.equal(t('m045'), 'Prompt Enhance')
  assert.equal(formatLocale(),'en-US'); assert.match(dateLabel('2026-10-28'),/Oct 28, 2026/)
  assert.doesNotMatch(localize(canonical), /[\p{Script=Han}]/u)
  assert.equal(localize(canonical, describeMessage(canonical)),localize(canonical))
  assert.match(diagnostic('upstream ERR_42'), /external service.*upstream ERR_42/)
  assert.equal(localize('用户自定义模型甲'), '用户自定义模型甲')
  const current=localize(canonical); setTestLocale('zh'); assert.equal(localize(current),canonical)
  assert.equal(t('m045'),'提示词增强')
 } finally { setTestLocale('zh') }
})

test('native subscription changes display without invoking business services and cleans up', () => {
 let active='zh', changes=0, stopped=0, removed=0; const callbacks=new Set<()=>void>(); const dispose:Array<()=>void>=[]
 const ctx={ locale:{ getSnapshot:()=>({active}), subscribe:(fn:()=>void)=>{ callbacks.add(fn);return()=>{callbacks.delete(fn);stopped++} },
 register:()=>()=>{removed++}, bind:()=> (key:MessageKey, params:Record<string,string|number>={})=>(active==='zh'?zh[key]:en[key]).replace(/\{(\w+)\}/g,(token,name)=>String(params[name]??token)) }, effect:(fn:()=>()=>void)=>dispose.push(fn()) } as unknown as Context
 const stop=subscribeLocale(()=>{changes++}); installLocale(ctx); active='en'; callbacks.forEach(fn=>fn())
 assert.equal(t('m045'),'Prompt Enhance'); assert.equal(changes,1)
 dispose.forEach(fn=>fn()); stop(); assert.equal(stopped,1);assert.equal(removed,1);assert.equal(callbacks.size,0)
})
