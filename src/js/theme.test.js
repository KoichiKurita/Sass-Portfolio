import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { THEME_KEY, currentTheme, setTheme, initThemeToggle } from './theme'

// OS の設定（prefers-color-scheme）を差し替えられる、window の代わりのオブジェクト
const fakeWindow = (osIsLight) => {
  const listeners = []
  const media = {
    matches: osIsLight,
    addEventListener: (_type, fn) => listeners.push(fn),
  }
  return {
    matchMedia: () => media,
    // OS の設定が変わったことを再現する
    changeOsTheme(isLight) {
      media.matches = isLight
      listeners.forEach((fn) => fn())
    },
  }
}

const html = document.documentElement

beforeEach(() => {
  localStorage.clear()
  delete html.dataset.theme
  document.body.innerHTML = '<button id="theme-toggle" aria-pressed="true"></button>'
})

describe('currentTheme', () => {
  it.each([
    [true, 'light'],
    [false, 'dark'],
  ])('テーマを選んでいなければ OS の設定に従う（OS がライト=%s → %s）', (osIsLight, expected) => {
    expect(currentTheme(document, fakeWindow(osIsLight))).toBe(expected)
  })

  it('選んだテーマ（data-theme）は OS の設定より優先する', () => {
    html.dataset.theme = 'dark'

    expect(currentTheme(document, fakeWindow(true))).toBe('dark')
  })

  it('data-theme に想定外の値が入っていたら、OS の設定に従う', () => {
    html.dataset.theme = 'purple'

    expect(currentTheme(document, fakeWindow(true))).toBe('light')
  })
})

describe('setTheme', () => {
  it('画面に反映し、localStorage に保存する', () => {
    setTheme('light')

    expect(html.dataset.theme).toBe('light')
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
  })

  it('保存に失敗しても、画面への反映は行う', () => {
    const brokenStorage = {
      setItem() {
        throw new DOMException('denied', 'SecurityError')
      },
    }

    expect(() => setTheme('light', document, brokenStorage)).not.toThrow()
    expect(html.dataset.theme).toBe('light')
  })
})

describe('initThemeToggle', () => {
  const button = () => document.getElementById('theme-toggle')

  it('初期化時に、今のテーマに合わせて aria-pressed を設定する', () => {
    initThemeToggle(button(), document, fakeWindow(true)) // OS はライト

    expect(button().getAttribute('aria-pressed')).toBe('false')
  })

  it('クリックでテーマを切り替え、保存し、aria-pressed も更新する', () => {
    initThemeToggle(button(), document, fakeWindow(false)) // OS はダーク

    button().click()

    expect(html.dataset.theme).toBe('light')
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
    expect(button().getAttribute('aria-pressed')).toBe('false')

    button().click()

    expect(html.dataset.theme).toBe('dark')
    expect(button().getAttribute('aria-pressed')).toBe('true')
  })

  it('テーマを選んでいない状態で OS の設定が変わったら、aria-pressed を合わせる', () => {
    const win = fakeWindow(false)
    initThemeToggle(button(), document, win)

    win.changeOsTheme(true)

    expect(button().getAttribute('aria-pressed')).toBe('false')
  })
})

describe('public/theme-init.js（描画前に実行する初期化スクリプト）', () => {
  const runInitScript = async () => {
    vi.resetModules() // 同じファイルを何度も実行できるようにする
    await import('../../public/theme-init.js')
  }

  it('保存済みのテーマを <html> の data-theme に反映する', async () => {
    localStorage.setItem(THEME_KEY, 'light')

    await runInitScript()

    expect(html.dataset.theme).toBe('light')
  })

  it('保存されていない・想定外の値のときは何もしない（OS の設定に従う）', async () => {
    localStorage.setItem(THEME_KEY, '<script>')

    await runInitScript()

    expect(html.dataset.theme).toBeUndefined()
  })

  it('theme.js と同じ保存キーを使っている', () => {
    const source = readFileSync('public/theme-init.js', 'utf8')

    expect(source).toContain(`'${THEME_KEY}'`)
  })
})
