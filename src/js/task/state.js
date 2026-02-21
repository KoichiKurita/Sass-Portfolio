let tasks = []
let filter = 'all'

export function setTasks(data) {
  tasks = data
}

export function getTasks() {
  return tasks
}

export function addTask(task) {
  tasks.push(task)
}

export function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id)
}

export function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )
}

export function setFilter(value) {
  filter = value
}

export function getFilter() {
  return filter
}
