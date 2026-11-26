import { describe, it, expect, beforeEach, vi } from 'vitest'
import { load, save, isValidTask, MAX_TEXT_LENGTH } from './storage'

const KEY = 'sass-portfolio:tasks:v1'
const LEGACY_KEY = 'tasks'

beforeEach(() => {
  localStorage.clear()
})

describe('isValidTask', () => {
  const valid = { id: 1, text: '牛乳を買う', completed: false }

  it('正しい形のタスクは true', () => {
    expect(isValidTask(valid)).toBe(true)
  })

  it('ちょうど上限文字数のテキストは true', () => {
    expect(isValidTask({ ...valid, text: 'a'.repeat(MAX_TEXT_LENGTH) })).toBe(true)
  })

  // 1つのテストを、入力を変えて何度も実行する（テーブル駆動テスト）
  it.each([
    ['null', null],
    ['文字列', 'task'],
    ['id が文字列', { ...valid, id: '1' }],
    ['id が NaN', { ...valid, id: NaN }],
    ['id が Infinity', { ...valid, id: Infinity }],
    ['text が数値', { ...valid, text: 123 }],
    ['text が空白だけ', { ...valid, text: '   ' }],
    ['text が上限を超える', { ...valid, text: 'a'.repeat(MAX_TEXT_LENGTH + 1) }],
    ['completed が文字列', { ...valid, completed: 'false' }],
    ['completed がない', { id: 1, text: 'A' }],
  ])('%s は false', (_label, input) => {
    expect(isValidTask(input)).toBe(false)
  })
})

describe('load', () => {
  it('何も保存されていなければ空配列を返す', () => {
    expect(load()).toEqual([])
  })

  it('保存済みのタスクを読み込める', () => {
    const tasks = [{ id: 1, text: 'A', completed: true }]
    localStorage.setItem(KEY, JSON.stringify(tasks))

    expect(load()).toEqual(tasks)
  })

  it('壊れた JSON でも例外を投げず、空配列を返して警告を出す', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    localStorage.setItem(KEY, '{broken')

    expect(load()).toEqual([])
    expect(warn).toHaveBeenCalledOnce()
  })

  it('配列でない値は空配列として扱う', () => {
    localStorage.setItem(KEY, JSON.stringify({ id: 1 }))

    expect(load()).toEqual([])
  })

  it('不正なタスクを取り除き、余計なプロパティも持ち込まない', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify([
        { id: 1, text: 'OK', completed: false, evil: '<script>' },
        { id: 'x', text: 'NG', completed: false },
        null,
      ])
    )

    expect(load()).toEqual([{ id: 1, text: 'OK', completed: false }])
  })

  it('旧キーのデータを新しいキーへ移行し、旧キーを削除する', () => {
    const legacy = [{ id: 5, text: '旧データ', completed: true }]
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy))

    expect(load()).toEqual(legacy)
    expect(JSON.parse(localStorage.getItem(KEY))).toEqual(legacy)
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull()
  })
})

describe('save', () => {
  it('保存できたら true を返し、load で読み戻せる', () => {
    const tasks = [{ id: 1, text: 'A', completed: false }]

    expect(save(tasks)).toBe(true)
    expect(load()).toEqual(tasks)
  })

  it('容量超過などで保存に失敗しても例外を投げず、false を返す', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    // localStorage.setItem が例外を投げる状況を再現する（モック）
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota exceeded', 'QuotaExceededError')
    })

    expect(save([{ id: 1, text: 'A', completed: false }])).toBe(false)
  })
})
