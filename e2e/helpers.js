// E2E テストで共通して使う処理

/**
 * ページで発生した CSP 違反を記録する
 * ページの読み込みより前に登録する必要があるため、page.goto() の前に呼ぶ
 */
export async function recordCspViolations(page) {
  await page.addInitScript(() => {
    window.__cspViolations = []
    document.addEventListener('securitypolicyviolation', (e) => {
      window.__cspViolations.push(`${e.violatedDirective} ${e.blockedURI}`)
    })
  })
  return () => page.evaluate(() => window.__cspViolations)
}

/** タスク管理ページでタスクを追加する（Enter キーで送信） */
export async function addTask(page, text) {
  const input = page.getByRole('textbox', { name: '新しいタスク' })
  await input.fill(text)
  await input.press('Enter')
}
