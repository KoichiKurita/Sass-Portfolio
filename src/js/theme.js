// ===============================
// テーマ（ダーク／ライト）の切り替えと保存
// ===============================
export const THEME_KEY = 'sass-portfolio:theme'
const THEMES = ['light', 'dark']
const LIGHT_QUERY = '(prefers-color-scheme: light)'

/**
 * 今表示されているテーマを返す
 * ユーザーが選んだテーマ（data-theme 属性）があればそれを、なければ OS の設定を使う
 */
export function currentTheme(doc = document, win = window) {
  const selected = doc.documentElement.dataset.theme
  if (THEMES.includes(selected)) return selected
  return win.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark'
}

/** テーマを画面に反映し、次回の表示のために保存する */
export function setTheme(theme, doc = document, storage = localStorage) {
  doc.documentElement.dataset.theme = theme
  try {
    storage.setItem(THEME_KEY, theme)
  } catch {
    // 保存できない環境（ストレージ無効など）でも、表示の切り替えは行う
  }
}

/** 切り替えボタンを初期化する */
export function initThemeToggle(button, doc = document, win = window) {
  // ボタンの押下状態（= ダークモードがオンか）をスクリーンリーダーに伝える
  const syncPressed = () => {
    button.setAttribute('aria-pressed', String(currentTheme(doc, win) === 'dark'))
  }

  syncPressed()

  button.addEventListener('click', () => {
    setTheme(currentTheme(doc, win) === 'dark' ? 'light' : 'dark', doc)
    syncPressed()
  })

  // テーマを選んでいない状態で OS の設定が変わると表示も変わるため、ボタンの状態を合わせる
  win.matchMedia(LIGHT_QUERY).addEventListener('change', syncPressed)
}
