let tasks = []
let filter = 'all'

export function setTasks(data) {
  tasks = data
}

export function getTasks() {
  return tasks
}

/**
 * 次に使うタスクの ID（既存の最大値 + 1）
 * Date.now() だと、同じミリ秒の間に追加したタスクの ID が重複するため使わない
 */
export function nextId() {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1
}

export function addTask(task) {
  tasks.push(task)
}

export function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id)
}

export function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
}

export function setFilter(value) {
  filter = value
}

export function getFilter() {
  return filter
}
