export function save(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

export function load() {
  return JSON.parse(localStorage.getItem('tasks')) || []
}
