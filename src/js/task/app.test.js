import { describe, it, expect, beforeEach } from 'vitest'
import { initTaskApp } from './app'
import { setFilter } from './state'

// task/index.html のタスク部分と同じ構造
const FIXTURE = `
  <form id="task-form">
    <label for="task-input">新しいタスク</label>
    <input type="text" id="task-input" />
    <button id="add-task" type="submit">Add</button>
  </form>
  <div role="group">
    <button type="button" data-filter="all" aria-pressed="true">All</button>
    <button type="button" data-filter="active" aria-pressed="false">Active</button>
    <button type="button" data-filter="completed" aria-pressed="false">Completed</button>
  </div>
  <ul id="task-list"></ul>
  <p id="task-status" role="status"></p>
`

const $ = (selector) => document.querySelector(selector)
const items = () => [...document.querySelectorAll('.task-item span')].map((el) => el.textContent)

// 入力欄に文字を入れて、フォームを送信する（Enter キーや Add ボタンと同じ）
const submitTask = (text) => {
  $('#task-input').value = text
  $('#task-form').requestSubmit()
}

beforeEach(() => {
  localStorage.clear()
  setFilter('all')
  document.body.innerHTML = FIXTURE
  initTaskApp()
})

describe('タスクの追加', () => {
  it('フォームの送信でタスクを追加し、入力欄を空にして、結果を読み上げる', () => {
    submitTask('牛乳を買う')

    expect(items()).toEqual(['牛乳を買う'])
    expect($('#task-input').value).toBe('')
    expect($('#task-status').textContent).toBe('「牛乳を買う」を追加しました')
  })

  it('追加したタスクを localStorage に保存する', () => {
    submitTask('牛乳を買う')

    const saved = JSON.parse(localStorage.getItem('sass-portfolio:tasks:v1'))
    expect(saved.map((t) => t.text)).toEqual(['牛乳を買う'])
  })

  it('空白だけの入力では追加しない', () => {
    submitTask('   ')

    expect(items()).toEqual([])
  })
})

describe('完了の切り替え', () => {
  it('再描画後も、同じタスクのチェックボックスにフォーカスが戻る', () => {
    submitTask('A')
    submitTask('B')

    $('.task-item:last-child input').click()

    const focused = document.activeElement
    expect(focused.type).toBe('checkbox')
    expect(focused.closest('.task-item').querySelector('span').textContent).toBe('B')
    expect(focused.checked).toBe(true)
    expect($('#task-status').textContent).toBe('「B」を完了にしました')
  })

  it('もう一度押すと未完了に戻り、その結果を読み上げる', () => {
    submitTask('A')

    $('.task-item input').click()
    $('.task-item input').click()

    expect($('.task-item input').checked).toBe(false)
    expect($('#task-status').textContent).toBe('「A」を未完了にしました')
  })

  it('タスク名の文字をクリックしても、何も変わらない', () => {
    submitTask('A')

    $('.task-item span').click()

    expect($('.task-item input').checked).toBe(false)
    expect($('#task-status').textContent).toBe('「A」を追加しました')
  })

  it('絞り込みで非表示になった場合は、入力欄にフォーカスを移す', () => {
    submitTask('A')
    $('[data-filter="active"]').click()

    $('.task-item input').click()

    expect(items()).toEqual([])
    expect(document.activeElement).toBe($('#task-input'))
  })
})

describe('削除', () => {
  it('削除後は入力欄にフォーカスを移し、結果を読み上げる', () => {
    submitTask('A')

    $('.task-item .delete').click()

    expect(items()).toEqual([])
    expect(document.activeElement).toBe($('#task-input'))
    expect($('#task-status').textContent).toBe('「A」を削除しました')
  })
})

describe('絞り込み', () => {
  it('押したボタンだけ aria-pressed="true" になる', () => {
    $('[data-filter="completed"]').click()

    const pressed = [...document.querySelectorAll('[data-filter]')].map((b) => [
      b.dataset.filter,
      b.getAttribute('aria-pressed'),
    ])
    expect(pressed).toEqual([
      ['all', 'false'],
      ['active', 'false'],
      ['completed', 'true'],
    ])
  })
})
