import { setTasks, addTask, removeTask, toggleTask, setFilter, getTasks } from './state'

import { save, load, MAX_TEXT_LENGTH } from './storage'
import { render } from './ui'

const taskInput = document.getElementById('task-input')
const addTaskBtn = document.getElementById('add-task')
const taskList = document.getElementById('task-list')
const filterButtons = document.querySelectorAll('[data-filter]')

setTasks(load())
render(taskList)
taskInput.maxLength = MAX_TEXT_LENGTH // 入力欄の文字数上限を保存時の検証ルールと揃える

addTaskBtn.addEventListener('click', () => {
  // 前後の空白を除き、上限を超える分は切り捨てる（入力欄以外から値が入っても守れるように）
  const text = taskInput.value.trim().slice(0, MAX_TEXT_LENGTH)
  if (!text) return

  addTask({
    id: Date.now(),
    text,
    completed: false,
  })

  save(getTasks())
  taskInput.value = ''
  render(taskList)
})

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setFilter(btn.dataset.filter)
    render(taskList)
  })
})

taskList.addEventListener('click', (e) => {
  const li = e.target.closest('.task-item')
  if (!li) return

  const id = Number(li.dataset.id)

  if (e.target.type === 'checkbox') {
    toggleTask(id)
  }

  if (e.target.classList.contains('delete')) {
    removeTask(id)
  }

  save(getTasks())
  render(taskList)
})
