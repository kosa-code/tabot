import { Fragment } from 'react'

import { CATEGORIES } from '@/components/trip/AddPlaceForm'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { dateKey, formatDate, formatMinutes, formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'

type Props = {
  items: TimelineItem[]
  onMove: (tripPlaceId: string, direction: -1 | 1) => void
  onRemove: (tripPlaceId: string) => void
  onStayChange: (tripPlaceId: string, stayMinutes: number) => void
}

function categoryLabel(value: string | null): string | null {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function Timeline({ items, onMove, onRemove, onStayChange }: Props) {
  const totalWarnings = items.reduce((n, item) => n + item.warnings.length, 0)

  return (
    <Card>
      <CardHeader
        title="タイムライン"
        action={
          <div className="flex items-center gap-2 text-[12px] text-neutral-500">
            <span>{items.length} 箇所</span>
            {totalWarnings > 0 && <Badge tone="warning">注意 {totalWarnings}</Badge>}
          </div>
        }
      />
      <CardBody className="px-3 py-2 sm:px-5">
        {items.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-neutral-500">
            まだ場所がありません。左のフォームから追加してください。
          </p>
        ) : (
          <ol>
            {items.map((item, index) => {
              const prev = items[index - 1]
              const newDay = !prev || dateKey(prev.arrive) !== dateKey(item.arrive)
              return (
                <Fragment key={item.tripPlace.id}>
                  {index > 0 && (
                    <li className="flex items-center gap-3 py-1 pl-[3.25rem] text-[12px] text-neutral-500">
                      <span aria-hidden className="h-6 w-px bg-neutral-300" />
                      <span>移動 {formatMinutes(item.travelMinutes)}</span>
                    </li>
                  )}
                  {newDay && (
                    <li className="pt-3 pb-1 text-[12px] font-semibold text-neutral-500">
                      {formatDate(item.arrive)}
                    </li>
                  )}
                  <li className="group flex gap-3 rounded-xl py-2 pr-1 pl-1 hover:bg-neutral-50">
                    <div className="w-11 shrink-0 pt-0.5 text-right tabular-nums">
                      <div className="text-[14px] font-semibold">{formatTime(item.arrive)}</div>
                      {item.tripPlace.stay_minutes > 0 && (
                        <div className="text-[11px] text-neutral-400">{formatTime(item.depart)}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-medium">{item.place.name}</span>
                        {item.place.category && <Badge>{categoryLabel(item.place.category)}</Badge>}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-500">
                        <label className="flex items-center gap-1">
                          滞在
                          <input
                            type="number"
                            min={0}
                            step={5}
                            value={item.tripPlace.stay_minutes}
                            onChange={(e) => onStayChange(item.tripPlace.id, Number(e.target.value))}
                            className="h-6 w-16 rounded-md border border-neutral-300 bg-white px-1.5 text-right tabular-nums focus:border-accent focus:outline-none"
                          />
                          分
                        </label>
                        {item.place.opening_hours === null && <span>営業時間: 未登録</span>}
                      </div>
                      {item.warnings.length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                          {item.warnings.map((w) => (
                            <li key={w} className="text-[12px] text-amber-800">
                              ⚠ {w}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col gap-0.5 opacity-60 group-hover:opacity-100">
                      <Button size="sm" variant="ghost" aria-label="上へ" disabled={index === 0} onClick={() => onMove(item.tripPlace.id, -1)}>
                        ↑
                      </Button>
                      <Button size="sm" variant="ghost" aria-label="下へ" disabled={index === items.length - 1} onClick={() => onMove(item.tripPlace.id, 1)}>
                        ↓
                      </Button>
                      <Button size="sm" variant="danger" aria-label="削除" onClick={() => onRemove(item.tripPlace.id)}>
                        ×
                      </Button>
                    </div>
                  </li>
                </Fragment>
              )
            })}
          </ol>
        )}
      </CardBody>
    </Card>
  )
}
