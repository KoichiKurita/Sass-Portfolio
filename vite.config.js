// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  // GitHub Pages は https://<user>.github.io/<repo>/ で配信されるため、リポジトリ名をベースパスにする
  base: '/Sass-Portfolio/',
  build: {
    rolldownOptions: {
      // マルチページ構成：ビルド対象の HTML を明示する
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        task: resolve(import.meta.dirname, 'task/index.html'),
      },
    },
  },
})
