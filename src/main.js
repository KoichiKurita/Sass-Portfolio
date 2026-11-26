import './scss/main.scss'

const toggle = document.getElementById('theme-toggle')
const header = document.querySelector('.l-header')

if (toggle) {
  toggle.addEventListener('click', () => {
    const html = document.documentElement
    const isDark = html.dataset.theme !== 'dark' // 切り替え後にダークモードになるか
    html.dataset.theme = isDark ? 'dark' : 'light'
    // ボタンの押下状態（= ダークモードがオンか）をスクリーンリーダーに伝える
    toggle.setAttribute('aria-pressed', String(isDark))
  })
}

// スクロールしたらヘッダーの背景を濃くする
// passive: true … スクロールを止める処理（preventDefault）をしないとブラウザに伝え、スクロールを滑らかにする
window.addEventListener(
  'scroll',
  () => {
    header.classList.toggle('is-scrolled', window.scrollY > 50)
  },
  { passive: true }
)
