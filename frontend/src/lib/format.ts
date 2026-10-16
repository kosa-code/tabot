import type { Warning } from '@/lib/schedule'

// 表示タイムゾーンは仮。trips にタイムゾーン列が無いため、モックでは旅行先に固定する
export const DISPLAY_TIME_ZONE = 'Europe/Rome'
/** 画面に出すときの表記。IANA の ID はそのまま出さない */
export const DISPLAY_TIME_ZONE_LABEL = 'ローマ時間'

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

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
    year: Number(map.year),
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

/** 2026年11月1日(日) 8:00 のような長い表記。withYear を外すと月から */
export function formatDateTimeLong(date: Date, withYear = true): string {
  const p = parts(date)
  const ymd = `${withYear ? `${p.year}年` : ''}${p.month}月${p.day}日(${WEEKDAYS_JA[p.weekdayIndex]})`
  return `${ymd} ${Number(p.hour)}:${p.minute}`
}

export function dateKey(date: Date): string {
  const p = parts(date)
  return `${p.year}-${p.month}-${p.day}`
}

/** opening_hours のキー(mon, tue, ...)を返す */
export function weekdayKey(date: Date): string {
  return WEEKDAY_KEYS[parts(date).weekdayIndex]
}

/** 旅行の日数(表示タイムゾーンの暦日で数える) */
export function tripDays(start: Date, end: Date): number {
  const a = parts(start)
  const b = parts(end)
  const da = Date.UTC(a.year, a.month - 1, a.day)
  const db = Date.UTC(b.year, b.month - 1, b.day)
  return Math.round((db - da) / 86_400_000) + 1
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

/** 表示タイムゾーンでの UTC オフセット(分)。夏時間を考慮する */
function offsetMinutesAt(utc: Date): number {
  const p = parts(utc)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, Number(p.hour), Number(p.minute))
  return Math.round((asUtc - utc.getTime()) / 60_000)
}

/** datetime-local の値(表示タイムゾーン基準)を ISO 文字列に戻す。toLocalInputValue の逆 */
export function fromLocalInputValue(value: string): string {
  const [datePart, timePart] = value.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const [hh, mm] = timePart.split(':').map(Number)
  // いったん UTC として解釈し、その時点のオフセットで補正する(境界の1時間は近似)
  const guess = Date.UTC(y, m - 1, d, hh, mm)
  const offset = offsetMinutesAt(new Date(guess))
  const fixed = new Date(guess - offset * 60_000)
  const offset2 = offsetMinutesAt(fixed)
  return new Date(guess - offset2 * 60_000).toISOString()
}

/** 警告の種類を表示用の文に変える */
export function warningLabel(w: Warning): string {
  switch (w.kind) {
    case 'closed':
      return 'この曜日は休業日です'
    case 'before-open':
      return `開店前に到着します(開店 ${w.at})`
    case 'after-close':
      return `閉店後に到着します(閉店 ${w.at})`
    case 'closes-during':
      return `滞在中に閉店します(閉店 ${w.at})`
    case 'past-trip-end':
      return '旅行の終了時刻を超えています'
  }
}
