// ===============================
// Vite プラグイン：HTML の %VITE_〇〇% が置き換わらずに残っていたら、ビルドを失敗させる
// ===============================
// Vite は未定義の環境変数を見つけても警告を出すだけで、ビルド自体は成功してしまう。
// そのまま公開すると、OGP の URL などが壊れたサイトが気づかれずにデプロイされるため、ここで止める。

const PLACEHOLDER = /%VITE_[A-Z0-9_]+%/g

export function findUnresolvedPlaceholders(html) {
  return [...new Set(html.match(PLACEHOLDER) ?? [])]
}

export function envPlaceholderCheck() {
  return {
    name: 'env-placeholder-check',
    apply: 'build',
    transformIndexHtml: {
      order: 'post', // Vite が環境変数を置き換えた「後」の HTML を確認する
      handler(html, { path }) {
        const unresolved = findUnresolvedPlaceholders(html)
        if (unresolved.length > 0) {
          throw new Error(
            `[env-placeholder-check] ${path} に未定義の環境変数があります: ${unresolved.join(', ')}（.env を確認してください）`
          )
        }
        return html
      },
    },
  }
}
