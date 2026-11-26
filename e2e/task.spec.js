// ===============================
// タスク管理アプリ：キーボードだけで操作できるか
// ===============================
import { test, expect } from '@playwright/test'
import { addTask, recordCspViolations } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await page.goto('task/')
})

test('Enter キーでタスクを追加し、結果が読み上げ用の領域に表示される', async ({ page }) => {
  await addTask(page, '牛乳を買う')

  await expect(page.getByRole('list', { name: 'タスク一覧' }).getByRole('listitem')).toHaveText([
    /牛乳を買う/,
  ])
  await expect(page.getByRole('status')).toHaveText('「牛乳を買う」を追加しました')
  await expect(page.getByRole('textbox', { name: '新しいタスク' })).toHaveValue('')
})

test('Space キーで完了にした後も、同じチェックボックスにフォーカスが残る', async ({ page }) => {
  await addTask(page, 'A')
  await addTask(page, 'B')
  const checkbox = page.getByRole('checkbox', { name: '「B」を完了にする' })

  await checkbox.focus()
  await page.keyboard.press('Space')

  await expect(checkbox).toBeChecked()
  await expect(checkbox).toBeFocused()
})

test('削除すると、フォーカスが入力欄に移る', async ({ page }) => {
  await addTask(page, 'A')

  await page.getByRole('button', { name: '「A」を削除' }).press('Enter')

  await expect(page.getByRole('list', { name: 'タスク一覧' }).getByRole('listitem')).toHaveCount(0)
  await expect(page.getByRole('textbox', { name: '新しいタスク' })).toBeFocused()
})

test('絞り込みボタンの選択状態が aria-pressed で伝わる', async ({ page }) => {
  await addTask(page, 'A')
  await addTask(page, 'B')
  await page.getByRole('checkbox', { name: '「A」を完了にする' }).check()

  const completed = page.getByRole('button', { name: 'Completed' })
  await completed.click()

  await expect(completed).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('list', { name: 'タスク一覧' }).getByRole('listitem')).toHaveText([
    /A/,
  ])
})

test('再読み込みしても、タスクと完了状態が残っている', async ({ page }) => {
  await addTask(page, 'A')
  await page.getByRole('checkbox', { name: '「A」を完了にする' }).check()

  await page.reload()

  await expect(page.getByRole('checkbox', { name: '「A」を完了にする' })).toBeChecked()
})

test('通常の操作で CSP 違反が発生しない', async ({ page }) => {
  const getViolations = await recordCspViolations(page)
  await page.goto('task/')

  await addTask(page, 'A')
  await page.getByRole('checkbox', { name: '「A」を完了にする' }).check()
  await page.getByRole('button', { name: '「A」を削除' }).click()

  expect(await getViolations()).toEqual([])
})
