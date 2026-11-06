const DATE_TIME: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}

const TIME: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', DATE_TIME)
}

export function formatTime(iso: string | null) {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString('ja-JP', TIME)
}

export function formatPeriod(startIso: string, endIso: string) {
  const sameDay =
    new Date(startIso).toDateString() === new Date(endIso).toDateString()
  const end = sameDay ? formatTime(endIso) : formatDateTime(endIso)
  return `${formatDateTime(startIso)} 〜 ${end}`
}

// <input type="datetime-local"> 用の形（ブラウザの時刻、例: 2026-11-05T10:00）
export function toDateTimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
