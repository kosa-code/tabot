import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { SegmentBar } from '@/components/ui/SegmentBar'
import { Stat } from '@/components/ui/Stat'
import { formatMinutes, formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'

export function ItineraryCard({ items }: { items: TimelineItem[] }) {
  const travel = items.reduce((n, i) => n + i.travelMinutes, 0)
  const stay = items.reduce((n, i) => n + i.tripPlace.stay_minutes, 0)
  const total = travel + stay
  const last = items.at(-1)

  const segments = [
    { label: '移動', minutes: travel, color: 'bg-secondary' },
    { label: '滞在', minutes: stay, color: 'bg-secondary-light' },
  ]

  return (
    <Card>
      <CardHeader title="行程" />
      <CardBody>
        <Stat value={items.length} unit="箇所" note={`合計 ${formatMinutes(total)}`} />

        <div className="mt-5">
          <SegmentBar label="移動と滞在の割合" segments={segments.map((s) => ({ ratio: total ? s.minutes / total : 0, className: s.color }))} />
        </div>

        <ul className="mt-4 space-y-2 text-small">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-fg-muted">
                <span className={`size-2 rounded-full ${s.color}`} />
                {s.label}
              </span>
              <span className="font-medium text-fg-strong tabular-nums">{formatMinutes(s.minutes)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between border-t border-neutral-100 pt-2">
            <span className="text-fg-muted">最終地点を出る</span>
            <span className="font-medium text-fg-strong tabular-nums">{last ? formatTime(last.depart) : '—'}</span>
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}
