// ===============================
// タスク管理アプリ：画面の要素とイベントを結び付ける
// ===============================
import { setTasks, addTask, removeTask, toggleTask, setFilter, getTasks, nextId } from './state'
import { save, load, MAX_TEXT_LENGTH } from './storage'
import { render } from './ui'

export function initTaskApp(doc = document) {
  const form = doc.getElementById('task-form')
  const taskInput = doc.getElementById('task-input')
  const taskList = doc.getElementById('task-list')
  const status = doc.getElementById('task-status')
  const filterButtons = doc.querySelectorAll('[data-filter]')

  // 操作の結果をスクリーンリーダーに読み上げさせる（role="status" の要素の文字を書き換える）
  const announce = (message) => {
    status.textContent = message
  }

  const saveAndRender = () => {
    save(getTasks())
    render(taskList)
  }

  // 再描画で要素が作り直されるため、同じタスクのチェックボックスにフォーカスを戻す
  // （絞り込みで非表示になった場合は、入力欄に移す）
  const focusTask = (id) => {
    const checkbox = taskList.querySelector(`[data-id="${id}"] input`)
    ;(checkbox ?? taskInput).focus()
  }

  setTasks(load())
  render(taskList)
  taskInput.maxLength = MAX_TEXT_LENGTH // 入力欄の文字数上限を保存時の検証ルールと揃える

  // フォームの送信 = 「Add」ボタンのクリック、または入力欄での Enter キー
  form.addEventListener('submit', (e) => {
    e.preventDefault() // ページを再読み込みする、フォームの既定の動作を止める

    // 前後の空白を除き、上限を超える分は切り捨てる（入力欄以外から値が入っても守れるように）
    const text = taskInput.value.trim().slice(0, MAX_TEXT_LENGTH)
    if (!text) return

    addTask({ id: nextId(), text, completed: false })
    saveAndRender()
    taskInput.value = ''
    announce(`「${text}」を追加しました`)
  })

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setFilter(button.dataset.filter)
      // 選択中のボタンだけ aria-pressed="true" にする（見た目もこの属性で切り替える）
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
      render(taskList)
    })
  })

  taskList.addEventListener('click', (e) => {
    const item = e.target.closest('.task-item')
    if (!item) return

    const id = Number(item.dataset.id)
    const text = item.querySelector('span').textContent

    if (e.target.type === 'checkbox') {
      toggleTask(id)
      saveAndRender()
      focusTask(id)
      announce(`「${text}」を${e.target.checked ? '完了' : '未完了'}にしました`)
      return
    }

    if (e.target.classList.contains('delete')) {
      removeTask(id)
      saveAndRender()
      taskInput.focus() // 押したボタン自体が消えるため、入力欄にフォーカスを移す
      announce(`「${text}」を削除しました`)
    }
  })
}
