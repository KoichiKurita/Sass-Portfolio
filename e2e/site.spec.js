// ===============================
// サイト全体：テーマ・スキップリンク・JS が動かないときの表示など
// ===============================
import { test, expect } from '@playwright/test'
import { recordCspViolations } from './helpers.js'

test.describe('テーマ', () => {
  test.describe('OS がライトの設定', () => {
    test.use({ colorScheme: 'light' })

    test('初回は OS の設定に従い、ライトテーマで表示される', async ({ page }) => {
      await page.goto('./')

      await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 245, 250)')
      await expect(page.getByRole('button', { name: 'ダークモード' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })

    test('選んだテーマは保存され、再読み込みや別のページでも OS の設定より優先される', async ({
      page,
    }) => {
      await page.goto('./')
      await page.getByRole('button', { name: 'ダークモード' }).click()

      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

      await page.goto('task/')
      await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(15, 15, 26)')
    })
  })
})

test('ページを開いて最初の Tab で、スキップリンクが表示される', async ({ page, isMobile }) => {
  test.skip(isMobile, 'スマホにはキーボードの Tab 操作がないため、PC だけで確認する')
  await page.goto('./')

  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: '本文へスキップ' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeInViewport()

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('Projects のカードが、すべて実在するリンク先を指している', async ({ page }) => {
  await page.goto('./')

  const cards = page.locator('#projects .c-card')
  await expect(cards).toHaveCount(7)

  for (const href of await cards.evaluateAll((els) => els.map((el) => el.href))) {
    expect(href).toMatch(/^https:\/\/github\.com\/KoichiKurita\/|\/Sass-Portfolio\/task\/$/)
  }
})

test('トップページで CSP 違反が発生しない', async ({ page }) => {
  const getViolations = await recordCspViolations(page)
  await page.goto('./')

  await page.getByRole('button', { name: 'ダークモード' }).click()
  await page.mouse.wheel(0, 3000)

  expect(await getViolations()).toEqual([])
})

test.describe('JavaScript が無効なとき', () => {
  test.use({ javaScriptEnabled: false })

  test('すべてのセクションが表示される（真っ白にならない）', async ({ page }) => {
    await page.goto('./')

    for (const section of await page.locator('main section').all()) {
      await section.scrollIntoViewIfNeeded()
      await expect(section).toHaveCSS('opacity', '1')
    }
  })

  test('タスク管理ページで、JavaScript を有効にするよう案内する', async ({ page }) => {
    await page.goto('task/')

    await expect(page.getByText(/JavaScript を有効にしてください/)).toBeVisible()
  })
})
