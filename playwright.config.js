// ===============================
// Playwright（E2E テスト）の設定
// ===============================
// 本番と同じビルド結果（vite preview）に対して、実際のブラウザでテストする。
// CSP など本番ビルドだけに入る設定も含めて確認できる。
import { defineConfig, devices } from '@playwright/test'
import process from 'node:process'

const PORT = 4173
const BASE_URL = `http://localhost:${PORT}/Sass-Portfolio/`
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI, // CI で test.only が残っていたら失敗させる（一部のテストだけ実行されるのを防ぐ）
  retries: isCI ? 1 : 0, // 一時的な失敗かどうかを見分けるため、CI では 1 回だけ再実行する
  timeout: 60_000, // 1 テストあたりの制限時間（既定は 30 秒）。PC の性能によって時間がかかるため余裕を持たせる
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    // ページの移動は page.goto('task/') のように「/ で始めない相対パス」で書く
    // （/task/ と書くと /Sass-Portfolio/ が外れてしまう）
    baseURL: BASE_URL,
    trace: 'retain-on-failure', // 失敗したテストだけ、操作の記録を残す
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  // テストの前にビルドしてプレビューサーバーを起動する
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !isCI, // ローカルでは起動済みのサーバーをそのまま使う
    timeout: 120_000,
  },
})
