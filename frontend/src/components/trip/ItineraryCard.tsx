import { ShellCard } from '@/components/ui/ShellCard'
import { formatMinutes, formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'

export function ItineraryCard({ items }: { items: TimelineItem[] }) {
  const travel = items.reduce((n, i) => n + i.travelMinutes, 0)
  const stay = items.reduce((n, i) => n + i.tripPlace.stay_minutes, 0)
  const total = travel + stay
  const last = items.at(-1)

  const segments = [
    { label: '移動', minutes: travel, color: 'bg-slate-400' },
    { label: '滞在', minutes: stay, color: 'bg-violet-400' },
  ]

  return (
    <ShellCard icon="route" title="行程" subtitle="移動と滞在の内訳">
      <div className="flex h-full flex-col">
        <div className="flex items-baseline justify-between">
          <div className="text-[28px] leading-none font-semibold tracking-[-0.02em] tabular-nums">{items.length} 箇所</div>
          <div className="text-[12px] text-neutral-500">合計 {formatMinutes(total)}</div>
        </div>

        <div className="mt-5 flex h-3 gap-1">
          {segments.map((s) => (
            <div key={s.label} className={`rounded-full ${s.color}`} style={{ flexBasis: total ? `${(s.minutes / total) * 100}%` : '0%' }} />
          ))}
        </div>

        <ul className="mt-4 space-y-2 text-[13px]">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-500">
                <span className={`size-2.5 rounded-full ${s.color}`} />
                {s.label}
              </span>
              <span className="font-medium tabular-nums">{formatMinutes(s.minutes)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between border-t border-neutral-100 pt-2">
            <span className="text-neutral-500">最終地点を出る</span>
            <span className="font-medium tabular-nums">{last ? formatTime(last.depart) : '—'}</span>
          </li>
        </ul>
      </div>
    </ShellCard>
  )
}
