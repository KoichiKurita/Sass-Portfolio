import { describe, it, expect } from 'vitest'
import { securityMeta, CSP } from './security-meta.js'

const transform = (html) => securityMeta().transformIndexHtml(html)

describe('securityMeta', () => {
  it('本番ビルドのときだけ動く（開発サーバーでは HMR を妨げない）', () => {
    expect(securityMeta().apply).toBe('build')
  })

  it('<meta charset> の直後に CSP と referrer の meta を追加する', () => {
    const html = '<head>\n    <meta charset="UTF-8" />\n    <title>t</title>\n</head>'

    const lines = transform(html)
      .split('\n')
      .map((l) => l.trim())

    expect(lines[1]).toBe('<meta charset="UTF-8" />')
    expect(lines[2]).toContain('http-equiv="Content-Security-Policy"')
    expect(lines[3]).toBe('<meta name="referrer" content="strict-origin-when-cross-origin" />')
  })

  it('<meta charset> がない HTML ではビルドを失敗させる（設定漏れに気づけるように）', () => {
    expect(() => transform('<head><title>t</title></head>')).toThrow('<meta charset>')
  })

  it.each([
    "script-src 'self'",
    "style-src 'self'",
    "object-src 'none'",
    "require-trusted-types-for 'script'",
  ])('CSP に「%s」を含む', (directive) => {
    expect(CSP).toContain(directive)
  })

  it('インラインスクリプトや eval を許可する指定を含まない', () => {
    expect(CSP).not.toMatch(/unsafe-inline|unsafe-eval/)
  })
})
