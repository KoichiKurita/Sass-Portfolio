import {
  setTasks,
  addTask,
  removeTask,
  toggleTask,
  setFilter,
  getTasks
} from './state'

import { save, load } from './storage'
import { render } from './ui'

const taskInput = document.getElementById('task-input')
const addTaskBtn = document.getElementById('add-task')
const taskList = document.getElementById('task-list')
const filterButtons = document.querySelectorAll('[data-filter]')

setTasks(load())
render(taskList)

addTaskBtn.addEventListener('click', () => {
  if (!taskInput.value.trim()) return

  addTask({
    id: Date.now(),
    text: taskInput.value,
    completed: false
  })

  save(getTasks())
  taskInput.value = ''
  render(taskList)
})

filterButtons.forEach(btn => {
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
