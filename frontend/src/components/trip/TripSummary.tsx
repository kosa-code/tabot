import { Card, CardBody } from '@/components/ui/Card'
import { formatMinutes, formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'

export function TripSummary({ items }: { items: TimelineItem[] }) {
  const travel = items.reduce((n, i) => n + i.travelMinutes, 0)
  const stay = items.reduce((n, i) => n + i.tripPlace.stay_minutes, 0)
  const last = items.at(-1)

  const stats = [
    { label: '訪問', value: `${items.length} 箇所` },
    { label: '移動の合計', value: formatMinutes(travel) },
    { label: '滞在の合計', value: formatMinutes(stay) },
    { label: '最終地点を出る', value: last ? formatTime(last.depart) : '—' },
  ]

  return (
    <Card>
      <CardBody className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-[12px] text-neutral-500">{s.label}</div>
            <div className="mt-0.5 text-[18px] font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}
