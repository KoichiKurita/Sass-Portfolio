import { getTasks, getFilter } from './state'

export function render(taskList) {
  const tasks = getTasks()
  const filter = getFilter()

  taskList.innerHTML = ''

  const filtered = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  filtered.forEach(task => {
    const li = document.createElement('li')
    li.className = 'task-item'
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} />
      <span class="${task.completed ? 'completed' : ''}">
        ${task.text}
      </span>
      <button class="delete">✕</button>
    `
    taskList.appendChild(li)
  })
}
