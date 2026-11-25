// ===============================
// 永続化層：localStorage への保存・読み込みだけを担当する
// ===============================

// キー名にアプリ名とバージョンを入れておくと、
// 同じドメインの他アプリと衝突せず、将来データ形式を変えるときも移行しやすい
const STORAGE_KEY = 'sass-portfolio:tasks:v1'
const LEGACY_KEY = 'tasks' // 旧バージョンで使っていたキー

export const MAX_TEXT_LENGTH = 100

/**
 * 1件のタスクが想定どおりの形かを検証する
 * localStorage は DevTools などで誰でも書き換えられるため、読み込んだ値は信用しない
 */
export function isValidTask(task) {
  return (
    typeof task === 'object' &&
    task !== null &&
    Number.isFinite(task.id) &&
    typeof task.text === 'string' &&
    task.text.trim().length > 0 &&
    task.text.length <= MAX_TEXT_LENGTH &&
    typeof task.completed === 'boolean'
  )
}

/**
 * 指定キーの値を読み込み、正しい形のタスクだけを返す
 * 値がない・JSON として壊れている・配列でない場合は null を返す
 */
function readTasks(key) {
  const raw = localStorage.getItem(key)
  if (raw === null) return null

  const data = JSON.parse(raw) // 壊れた JSON はここで例外になる（呼び出し元で処理）
  if (!Array.isArray(data)) return null

  // 必要な項目だけを取り出す（想定外のプロパティは持ち込まない）
  return data.filter(isValidTask).map(({ id, text, completed }) => ({ id, text, completed }))
}

export function load() {
  try {
    const tasks = readTasks(STORAGE_KEY)
    if (tasks !== null) return tasks

    // 新しいキーにデータがなければ、旧キーから移行する
    const legacyTasks = readTasks(LEGACY_KEY)
    if (legacyTasks !== null) {
      save(legacyTasks)
      localStorage.removeItem(LEGACY_KEY)
      return legacyTasks
    }
  } catch (error) {
    // JSON が壊れている、またはストレージ自体が使えない（ブラウザ設定など）
    console.warn('[storage] タスクを読み込めなかったため、空の状態で開始します', error)
  }
  return []
}

/**
 * @returns {boolean} 保存できたら true
 */
export function save(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch (error) {
    // 容量超過（QuotaExceededError）やストレージ無効時
    console.warn('[storage] タスクを保存できませんでした', error)
    return false
  }
}
