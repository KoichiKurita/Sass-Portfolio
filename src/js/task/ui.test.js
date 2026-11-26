import { describe, it, expect, beforeEach } from 'vitest'
import { render } from './ui'
import { setTasks, setFilter } from './state'

let taskList

beforeEach(() => {
  document.body.innerHTML = '<ul id="task-list"></ul>'
  taskList = document.getElementById('task-list')
  setTasks([
    { id: 1, text: '牛乳を買う', completed: false },
    { id: 2, text: '本を返す', completed: true },
  ])
  setFilter('all')
})

const texts = () => [...taskList.querySelectorAll('.task-item span')].map((el) => el.textContent)

describe('render', () => {
  it('タスクの数だけ li を描画し、data-id を付ける', () => {
    render(taskList)

    const items = taskList.querySelectorAll('li.task-item')
    expect(items).toHaveLength(2)
    expect([...items].map((li) => li.dataset.id)).toEqual(['1', '2'])
  })

  it('完了済みのタスクはチェック済みで、completed クラスが付く', () => {
    render(taskList)

    const [active, done] = taskList.querySelectorAll('.task-item')
    expect(active.querySelector('input').checked).toBe(false)
    expect(done.querySelector('input').checked).toBe(true)
    expect(done.querySelector('span').classList.contains('completed')).toBe(true)
  })

  it.each([
    ['all', ['牛乳を買う', '本を返す']],
    ['active', ['牛乳を買う']],
    ['completed', ['本を返す']],
  ])('フィルター %s で表示するタスクを絞り込める', (filter, expected) => {
    setFilter(filter)
    render(taskList)

    expect(texts()).toEqual(expected)
  })

  it('再描画しても重複しない（前回の内容を置き換える）', () => {
    render(taskList)
    render(taskList)

    expect(taskList.children).toHaveLength(2)
  })

  // XSS の回帰テスト：修正前の innerHTML 実装に戻すと、このテストが失敗する
  it('タスク名に含まれる HTML はタグとして解釈せず、文字として表示する', () => {
    const payload = '<img src=x onerror="alert(1)">'
    setTasks([{ id: 1, text: payload, completed: false }])

    render(taskList)

    expect(taskList.querySelector('img')).toBeNull()
    expect(texts()).toEqual([payload])
  })

  it('チェックボックスと削除ボタンに、タスク名を含む aria-label を付ける', () => {
    render(taskList)

    const first = taskList.querySelector('.task-item')
    expect(first.querySelector('input').getAttribute('aria-label')).toBe(
      '「牛乳を買う」を完了にする'
    )
    expect(first.querySelector('.delete').getAttribute('aria-label')).toBe('「牛乳を買う」を削除')
  })
})
