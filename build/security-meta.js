// ===============================
// Vite プラグイン：本番ビルドの HTML にセキュリティ用の <meta> を追加する
// ===============================
// GitHub Pages では HTTP レスポンスヘッダーを設定できないため、<meta> で指定する。
// 開発サーバーは HMR のためにインラインのスタイルやスクリプトを使うので、ビルド時だけ適用する。

/**
 * Content Security Policy：このページが読み込んでよいリソースの「許可リスト」
 * 許可していない読み込み・実行はブラウザがブロックする
 */
const CSP_DIRECTIVES = {
  // 下で個別に指定していない種類のリソースは、同じオリジン（自サイト）からのみ許可
  'default-src': ["'self'"],
  // JavaScript は自サイトのファイルだけ。インラインの <script> や eval() は実行させない
  'script-src': ["'self'"],
  // CSS も自サイトのファイルだけ。HTML 内の <style> や style 属性は適用させない
  'style-src': ["'self'"],
  // 画像は自サイトと data: URI（小さな画像の埋め込み）
  'img-src': ["'self'", 'data:'],
  // <object> / <embed>（Flash などのプラグイン）は一切使わない
  'object-src': ["'none'"],
  // <base> タグで相対 URL の基準を書き換えられないようにする
  'base-uri': ["'self'"],
  // フォームの送信先を自サイトに限定する
  'form-action': ["'self'"],
  // Trusted Types：innerHTML などの危険な API に文字列を直接渡すことを禁止する（対応ブラウザのみ）
  'require-trusted-types-for': ["'script'"],
  'trusted-types': ["'none'"],
}

export const CSP = Object.entries(CSP_DIRECTIVES)
  .map(([directive, values]) => `${directive} ${values.join(' ')}`)
  .join('; ')

const SECURITY_META = [
  `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
  // 他サイトへ移動するときは、URL のパス（ページの場所）を送らずオリジンだけ送る
  '<meta name="referrer" content="strict-origin-when-cross-origin" />',
]

export function securityMeta() {
  return {
    name: 'security-meta',
    apply: 'build', // 本番ビルドのときだけ動かす
    transformIndexHtml(html) {
      // 文字コードの指定（<meta charset>）は先頭に置くのが原則なので、その直後に追加する
      // CSP はスクリプトより前に書かないと、それより前のスクリプトに適用されない
      const charset = /<meta charset="[^"]*"\s*\/?>/i
      if (!charset.test(html)) {
        throw new Error('[security-meta] <meta charset> が見つかりません')
      }
      return html.replace(charset, (tag) => [tag, ...SECURITY_META].join('\n    '))
    },
  }
}
