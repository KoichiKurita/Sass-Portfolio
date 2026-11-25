import { getTasks, getFilter } from './state'

/**
 * 1件分のタスク要素（<li>）を作る
 * ユーザー入力（task.text）は必ず textContent で入れ、HTML として解釈させない
 */
function createTaskItem(task) {
  const li = document.createElement('li')
  li.className = 'task-item'
  li.dataset.id = String(task.id) // index.js がクリックされたタスクを特定するための ID

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = task.completed
  checkbox.setAttribute('aria-label', `「${task.text}」を完了にする`)

  const text = document.createElement('span')
  text.textContent = task.text
  text.classList.toggle('completed', task.completed)

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.className = 'delete'
  deleteButton.textContent = '✕'
  deleteButton.setAttribute('aria-label', `「${task.text}」を削除`)

  li.append(checkbox, text, deleteButton)
  return li
}

export function render(taskList) {
  const tasks = getTasks()
  const filter = getFilter()

  const filtered = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  // 既存の子要素をまとめて置き換える（innerHTML = '' を使わない）
  taskList.replaceChildren(...filtered.map(createTaskItem))
}
