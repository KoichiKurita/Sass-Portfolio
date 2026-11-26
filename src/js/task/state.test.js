import { describe, it, expect, beforeEach } from 'vitest'
import { setTasks, getTasks, addTask, removeTask, toggleTask, setFilter, getFilter } from './state'

// state.js はモジュール内の変数に状態を持つため、テストごとに初期状態へ戻す
beforeEach(() => {
  setTasks([])
  setFilter('all')
})

describe('state', () => {
  it('addTask でタスクを末尾に追加できる', () => {
    addTask({ id: 1, text: 'A', completed: false })
    addTask({ id: 2, text: 'B', completed: false })

    expect(getTasks().map((t) => t.text)).toEqual(['A', 'B'])
  })

  it('removeTask で指定した id のタスクだけを削除できる', () => {
    setTasks([
      { id: 1, text: 'A', completed: false },
      { id: 2, text: 'B', completed: false },
    ])

    removeTask(1)

    expect(getTasks()).toEqual([{ id: 2, text: 'B', completed: false }])
  })

  it('toggleTask で指定した id の完了状態だけを反転できる', () => {
    setTasks([
      { id: 1, text: 'A', completed: false },
      { id: 2, text: 'B', completed: false },
    ])

    toggleTask(2)

    expect(getTasks().map((t) => t.completed)).toEqual([false, true])
  })

  it('toggleTask は元のタスクのオブジェクトを書き換えない（イミュータブル）', () => {
    const original = { id: 1, text: 'A', completed: false }
    setTasks([original])

    toggleTask(1)

    expect(original.completed).toBe(false)
    expect(getTasks()[0]).not.toBe(original)
  })

  it('存在しない id を指定しても、何も変わらない', () => {
    setTasks([{ id: 1, text: 'A', completed: false }])

    removeTask(999)
    toggleTask(999)

    expect(getTasks()).toEqual([{ id: 1, text: 'A', completed: false }])
  })

  it('setFilter で絞り込み条件を変更できる', () => {
    expect(getFilter()).toBe('all')

    setFilter('completed')

    expect(getFilter()).toBe('completed')
  })
})
