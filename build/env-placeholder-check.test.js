import { describe, it, expect } from 'vitest'
import { findUnresolvedPlaceholders, envPlaceholderCheck } from './env-placeholder-check.js'

const check = (html) =>
  envPlaceholderCheck().transformIndexHtml.handler(html, { path: '/index.html' })

describe('envPlaceholderCheck', () => {
  it('本番ビルドのときだけ、環境変数の置き換えが終わった後に動く', () => {
    const plugin = envPlaceholderCheck()

    expect(plugin.apply).toBe('build')
    expect(plugin.transformIndexHtml.order).toBe('post')
  })

  it('置き換え済みの HTML はそのまま返す', () => {
    const html = '<meta property="og:image" content="https://example.com/ogp.jpg" />'

    expect(check(html)).toBe(html)
  })

  it('%VITE_〇〇% が残っていたら、変数名を含むエラーでビルドを止める', () => {
    const html = '<link rel="canonical" href="%VITE_SITE_URL%/" />'

    expect(() => check(html)).toThrow('%VITE_SITE_URL%')
  })

  it('同じ変数が何度出てきても、1回だけ報告する', () => {
    const html = '%VITE_SITE_URL% %VITE_SITE_URL% %VITE_OTHER%'

    expect(findUnresolvedPlaceholders(html)).toEqual(['%VITE_SITE_URL%', '%VITE_OTHER%'])
  })
})
