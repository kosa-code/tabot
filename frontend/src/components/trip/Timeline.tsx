import { Fragment } from 'react'

import { CATEGORIES } from '@/components/trip/AddPlaceForm'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
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

function IconButton({ icon, label, disabled, danger, onClick }: { icon: 'arrowUp' | 'arrowDown' | 'close'; label: string; disabled?: boolean; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-7 items-center justify-center rounded-lg transition-colors disabled:opacity-30',
        danger ? 'text-neutral-400 hover:bg-red-50 hover:text-red-600' : 'text-neutral-400 hover:bg-neutral-100 hover:text-ink',
      )}
    >
      <Icon name={icon} size={15} />
    </button>
  )
}

export function Timeline({ items, onMove, onRemove, onStayChange }: Props) {
  if (items.length === 0) {
    return <p className="py-12 text-center text-[13px] text-neutral-500">まだ場所がありません。「場所を追加」から登録してください。</p>
  }

  return (
    <ol className="px-1">
      {items.map((item, index) => {
        const prev = items[index - 1]
        const newDay = !prev || dateKey(prev.arrive) !== dateKey(item.arrive)
        return (
          <Fragment key={item.tripPlace.id}>
            {index > 0 && (
              <li className="flex items-center gap-3 py-1 pl-14 text-[12px] text-neutral-500">
                <span aria-hidden className="h-6 w-px bg-neutral-200" />
                <span className="flex items-center gap-1">
                  <Icon name="clock" size={13} />
                  移動 {formatMinutes(item.travelMinutes)}
                </span>
              </li>
            )}
            {newDay && (
              <li className="pt-3 pb-1">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">{formatDate(item.arrive)}</span>
              </li>
            )}
            <li className="group flex gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-neutral-50">
              <div className="w-12 shrink-0 pt-0.5 text-right tabular-nums">
                <div className="text-[14px] font-semibold">{formatTime(item.arrive)}</div>
                {item.tripPlace.stay_minutes > 0 && <div className="text-[11px] text-neutral-400">{formatTime(item.depart)}</div>}
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
                      className="h-6 w-16 rounded-md border border-neutral-200 bg-white px-1.5 text-right tabular-nums focus:border-accent focus:outline-none"
                    />
                    分
                  </label>
                  {item.place.opening_hours === null && <span>営業時間: 未登録</span>}
                </div>
                {item.warnings.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {item.warnings.map((w) => (
                      <li key={w} className="flex items-center gap-1 text-[12px] text-amber-700">
                        <Icon name="warning" size={13} />
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <IconButton icon="arrowUp" label="上へ" disabled={index === 0} onClick={() => onMove(item.tripPlace.id, -1)} />
                <IconButton icon="arrowDown" label="下へ" disabled={index === items.length - 1} onClick={() => onMove(item.tripPlace.id, 1)} />
                <IconButton icon="close" label="削除" danger onClick={() => onRemove(item.tripPlace.id)} />
              </div>
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
