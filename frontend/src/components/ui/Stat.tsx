import type { ReactNode } from 'react'

/** KPI の数字。単位は小さく添える */
export function Stat({ value, unit, note }: { value: ReactNode; unit?: string; note?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="text-display font-semibold text-fg-strong tabular-nums">
        {value}
        {unit && <span className="ml-1 text-title font-medium text-fg-muted">{unit}</span>}
      </div>
      {note && <div className="text-small text-fg-muted">{note}</div>}
    </div>
  )
}
