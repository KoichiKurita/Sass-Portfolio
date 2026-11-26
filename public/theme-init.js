// ===============================
// テーマの初期化（ページの描画より前に実行する）
// ===============================
// 保存済みのテーマを、ページが表示される前に <html> へ反映する。
// type="module" のスクリプトは HTML の解析後に実行されるため、それを待つと
// 一瞬だけ別のテーマで表示される（ちらつく）。そのため <head> で通常のスクリプトとして読み込む。
// CSP でインラインスクリプトを禁止しているので、HTML に直接書かずに別ファイルにしている。
// ※ キー名は src/js/theme.js の THEME_KEY と同じにする（テストで一致を確認している）
;(() => {
  try {
    const theme = localStorage.getItem('sass-portfolio:theme')
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.dataset.theme = theme
    }
  } catch {
    // ストレージが使えない環境では何もしない（CSS により OS の設定に従って表示される）
  }
})()
