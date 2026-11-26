// vite.config.js
// vitest/config の defineConfig は、Vite の設定に「test」項目を追加したもの
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'
import { securityMeta } from './build/security-meta.js'

export default defineConfig({
  // GitHub Pages は https://<user>.github.io/<repo>/ で配信されるため、リポジトリ名をベースパスにする
  base: '/Sass-Portfolio/',
  plugins: [securityMeta()],
  build: {
    rolldownOptions: {
      // マルチページ構成：ビルド対象の HTML を明示する
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        task: resolve(import.meta.dirname, 'task/index.html'),
      },
    },
  },
  test: {
    // document や localStorage を使うため、ブラウザを模した環境（jsdom）で実行する
    environment: 'jsdom',
    include: ['src/**/*.test.js', 'build/**/*.test.js'],
    // テストごとにモックを元に戻す（テスト同士が影響し合わないようにする）
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      // ロジックを持つモジュールだけを対象にする
      // index.js / main.js は DOM とイベントの結び付けが中心なので、将来の E2E テストで扱う
      include: ['src/js/task/{state,storage,ui}.js'],
      reporter: ['text', 'html'],
      // これを下回ったら CI を失敗させる
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
})
