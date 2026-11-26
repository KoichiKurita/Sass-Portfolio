import './scss/main.scss'
import { initThemeToggle } from './js/theme'

const toggle = document.getElementById('theme-toggle')
const header = document.querySelector('.l-header')

if (toggle) {
  initThemeToggle(toggle)
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
