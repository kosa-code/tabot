// 表示タイムゾーンは仮。trips にタイムゾーン列が無いため、モックでは旅行先に固定する
export const DISPLAY_TIME_ZONE = 'Europe/Rome'

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']

function parts(date: Date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: DISPLAY_TIME_ZONE,
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
  })
  const map = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  return {
    month: Number(map.month),
    day: Number(map.day),
    hour: map.hour === '24' ? '00' : map.hour,
    minute: map.minute,
    weekdayIndex: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday),
  }
}

export function formatTime(date: Date): string {
  const p = parts(date)
  return `${p.hour}:${p.minute}`
}

export function formatDate(date: Date): string {
  const p = parts(date)
  return `${p.month}/${p.day}(${WEEKDAYS_JA[p.weekdayIndex]})`
}

export function dateKey(date: Date): string {
  const p = parts(date)
  return `${p.month}-${p.day}`
}

/** opening_hours のキー(mon, tue, ...)を返す */
export function weekdayKey(date: Date): string {
  return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][parts(date).weekdayIndex]
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}分`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}時間` : `${h}時間${m}分`
}

export function formatYen(amount: number | null): string {
  if (amount == null) return '未設定'
  return `¥${amount.toLocaleString('ja-JP')}`
}

/** <input type="datetime-local"> 用の文字列(表示タイムゾーン基準) */
export function toLocalInputValue(iso: string): string {
  const date = new Date(iso)
  const fmt = new Intl.DateTimeFormat('sv-SE', {
    timeZone: DISPLAY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return fmt.format(date).replace(' ', 'T')
}
