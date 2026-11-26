// ===============================
// アクセシビリティの自動検査（axe-core）
// ===============================
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { addTask } from './helpers.js'

// WCAG 2.2 AA までの達成基準を検査する
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const pages = [
  { name: 'トップページ', path: './' },
  {
    name: 'タスク管理ページ（タスクあり）',
    path: 'task/',
    // 空の状態だけでなく、タスクや完了状態が表示された状態も検査する
    setup: async (page) => {
      await addTask(page, '牛乳を買う')
      await addTask(page, '本を返す')
      await page.getByRole('checkbox', { name: '「牛乳を買う」を完了にする' }).check()
    },
  },
]

for (const colorScheme of ['dark', 'light']) {
  test.describe(`${colorScheme} テーマ`, () => {
    // OS の設定（prefers-color-scheme）を切り替えて、両方のテーマの配色を検査する
    // reducedMotion: フェードインの途中（半透明）の状態で、コントラストを誤判定しないようにする
    test.use({ colorScheme, reducedMotion: 'reduce' })

    for (const { name, path, setup } of pages) {
      test(`${name} に WCAG 2.2 AA の違反がない`, async ({ page }) => {
        await page.goto(path)
        await setup?.(page)

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

        // 失敗したときに「どの要素が・何の基準に」違反しているかがわかるように整形する
        const violations = results.violations.map((v) => ({
          rule: v.id,
          impact: v.impact,
          targets: v.nodes.map((n) => n.target.join(' ')),
        }))
        expect(violations).toEqual([])
      })
    }
  })
}
