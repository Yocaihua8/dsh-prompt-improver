import assert from 'node:assert/strict'

export async function run(page) {
  await page.waitForFunction(() => !!window.fixture && !!document.querySelector('[data-composer-input]'))
  const results = []
  const state = () => page.evaluate(() => fixture.shell.state.getSnapshot())
  const ghost = () => page.waitForFunction(() => !!document.querySelector('.dsh-prediction-suffix'), undefined, { timeout: 7000 })
  const seed = async (text, suggestion = '，请举一个例子。') => {
    await page.evaluate(({ text, suggestion }) => { fixture.suggest(suggestion); fixture.seed(text); fixture.shell.focus() }, { text, suggestion })
    await page.keyboard.press('Control+End')
    await ghost()
  }
  await seed('请解释'); assert.equal((await state()).draft, '请解释')
  assert.equal(await page.evaluate(() => document.querySelector('[data-composer-input]').textContent), '请解释')
  await page.keyboard.press('Tab'); assert.equal((await state()).draft, '请解释，请举一个例子。')
  await page.keyboard.press('Control+z'); assert.equal((await state()).draft, '请解释')
  const afterAccept = await page.evaluate(() => fixture.requests.length)
  await page.waitForTimeout(950)
  assert.equal(await page.evaluate(() => fixture.requests.length), afterAccept)
  results.push('PASS suffix, ghost excluded from draft/copy, Tab inserts, one native undo, no repeated prediction')

  await seed('', '请换一个例子。')
  assert.equal(await page.locator('[data-composer-placeholder]').isVisible(), false)
  await page.keyboard.press('Escape')
  assert.equal((await state()).draft, ''); assert.equal(await page.locator('.dsh-prediction-suffix').count(), 0)
  results.push('PASS empty input prediction and Esc dismissal')

  await page.evaluate(() => {
    fixture.seed('')
    fixture.shell.draftEditor.clearHistory() // The real post-submission history boundary.
    fixture.shell.focus()
  })
  await page.keyboard.press('Control+End'); await ghost()
  await page.keyboard.press('Tab'); assert.equal((await state()).draft, '请换一个例子。')
  await page.keyboard.press('Control+z'); assert.equal((await state()).draft, '')
  results.push('PASS accepting into a just-submitted empty editor has one native undo')

  await seed('先解释'); await page.keyboard.press('Shift+Tab')
  assert.equal((await state()).draft, '先解释')
  results.push('PASS Shift+Tab preserves native navigation without acceptance')

  await seed('引用：@readme')
  await page.evaluate(() => {
    fixture.shell.setDraft({ text: '请解释 @readme', references: [{ source: 'file', ref: 'README.md', offset: 4, length: 7, label: 'readme', clipboardText: '@readme' }] })
    fixture.shell.addAttachments(['attachment-1']); fixture.events.set({ ...fixture.events.getSnapshot(), revision: fixture.events.getSnapshot().revision + 1 }); fixture.shell.focus()
  })
  await page.keyboard.press('Control+End')
  await ghost(); const original = await state()
  await page.keyboard.press('Tab'); const inserted = await state()
  assert.equal(inserted.occurrences[0].ref, 'README.md'); assert.deepEqual(inserted.attachmentIds, ['attachment-1'])
  assert.equal(inserted.draft, original.draft + '，请举一个例子。')
  await page.keyboard.press('Control+z'); assert.equal((await state()).draft, original.draft)
  results.push('PASS native reference chip, attachment and single-step undo preserved')

  await seed('输入法')
  await page.locator('[data-composer-input]').dispatchEvent('compositionstart', { data: 'zhong' })
  assert.equal(await page.locator('.dsh-prediction-suffix').count(), 0)
  await page.keyboard.press('Tab'); assert.equal((await state()).draft, '输入法')
  await page.locator('[data-composer-input]').dispatchEvent('compositionend', { data: '中' })
  results.push('PASS composition event sequence hides ghost and does not intercept Tab')

  await seed('菜单')
  await page.evaluate(() => { const menu = document.createElement('div'); menu.setAttribute('data-trigger-menu', ''); document.querySelector('[data-composer-card]').append(menu) })
  await page.waitForFunction(() => !document.querySelector('.dsh-prediction-suffix'))
  await page.keyboard.press('Tab'); assert.equal((await state()).draft, '菜单')
  assert.ok(await page.evaluate(() => fixture.menuTabs > 0))
  await page.evaluate(() => document.querySelector('[data-trigger-menu]').remove())
  results.push('PASS native trigger keymap has Tab priority')

  await page.evaluate(() => { fixture.setDelay(1500); fixture.seed('旧请求'); fixture.shell.focus() })
  await page.waitForFunction(() => fixture.requests.at(-1)?.request.draft === '旧请求')
  await page.getByRole('button', { name: '切换会话' }).click()
  await page.waitForTimeout(1600)
  assert.equal((await state()).draft, '新会话')
  assert.ok(await page.evaluate(() => fixture.requests.find(item => item.request.draft === '旧请求').signal.aborted))
  await page.evaluate(() => fixture.setDelay(80))
  results.push('PASS session switch cancels old requests and rejects late writes')

  await seed('开关')
  await page.getByRole('button', { name: '关闭预测', exact: true }).click()
  assert.equal(await page.locator('.dsh-prediction-suffix').count(), 0)
  await page.locator('[data-composer-input]').click()
  const disabledCount = await page.evaluate(() => fixture.requests.length)
  await page.waitForTimeout(950); assert.equal(await page.evaluate(() => fixture.requests.length), disabledCount)
  await page.getByRole('button', { name: '开启预测', exact: true }).click()
  results.push('PASS saving disabled setting immediately clears suggestions and stops calls')
  await seed('开始\n\n')
  await page.keyboard.press('Control+Home')
  await page.waitForFunction(() => !document.querySelector('.dsh-prediction-suffix'))
  assert.equal(await page.locator('.dsh-prediction-suffix').count(), 0)
  await page.keyboard.press('Tab'); assert.equal((await state()).draft, '开始\n\n')
  results.push('PASS caret before trailing empty paragraphs cannot accept an end-of-draft suggestion')

  await seed('增强同时使用')
  await page.getByRole('button', { name: '增强提示词', exact: true }).click()
  await page.waitForFunction(() => fixture.shell.state.getSnapshot().draft.endsWith('说明关键步骤。'))
  assert.equal(await page.locator('.dsh-prediction-suffix').count(), 0)
  results.push('PASS manual enhancement invalidates the prediction')

  await seed('第一行\n第二行\n第三行\n第四行\n第五行\n第六行\n第七行', '，补充说明。'.repeat(12))
  await page.evaluate(() => { const scroll = document.querySelector('[data-input-scroll]'); scroll.scrollTop = scroll.scrollHeight })
  const layout = await page.evaluate(() => {
    const scroll = document.querySelector('[data-input-scroll]'), suffix = document.querySelector('.dsh-prediction-suffix'), input = document.querySelector('[data-composer-input]')
    return { overflow: scroll.scrollHeight > scroll.clientHeight, suffixBottom: suffix.getBoundingClientRect().bottom, scrollBottom: scroll.getBoundingClientRect().bottom, inputText: input.textContent }
  })
  assert.ok(layout.overflow); assert.ok(layout.suffixBottom <= layout.scrollBottom + 1); assert.ok(!layout.inputText.includes('补充说明'))
  results.push('PASS multiline ghost shares native scroll area and remains absent from editor text')
  assert.equal(await page.evaluate(() => fixture.sent.length), 0)
  return results
}
