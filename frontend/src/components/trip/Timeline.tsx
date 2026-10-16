import { ArrowDown, ArrowUp, Check, Plus, TriangleAlert, X } from 'lucide-react'
import { Fragment } from 'react'

import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { InlineEdit } from '@/components/ui/InlineEdit'
import { findCategory } from '@/lib/categories'
import { cn } from '@/lib/cn'
import { dateKey, formatDate, formatMinutes, formatTime, warningLabel } from '@/lib/format'
import { timelineRowId } from '@/lib/ids'
import type { TimelineItem } from '@/lib/schedule'
import { ICON, STROKE } from '@/lib/ui'

type Props = {
  items: TimelineItem[]
  onMove: (tripPlaceId: string, direction: -1 | 1) => void
  onRemove: (tripPlaceId: string) => void
  onStayChange: (tripPlaceId: string, stayMinutes: number) => void
  onAdd: () => void
}

// レール上の丸。content の左 28px(= ol の左端)を中心に置く。ol の pl-7 と対で変える
const NODE = 'absolute -left-7 -translate-x-1/2 rounded-full'
// 時刻の列幅。移動行の字下げも同じ値を使う
const TIME_COL = 'w-14'

export function Timeline({ items, onMove, onRemove, onStayChange, onAdd }: Props) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-body text-fg-muted">まだ場所がありません。</p>
        <Button variant="ghost" icon={Plus} onClick={onAdd} className="mt-4">
          場所を追加
        </Button>
      </div>
    )
  }

  const last = items[items.length - 1]
  // 各行が何日目か。日付が変わる行で増える
  const dayOf = items.reduce<number[]>((acc, item, i) => {
    const prev = items[i - 1]
    const newDay = !prev || dateKey(prev.arrive) !== dateKey(item.arrive)
    acc.push((acc[i - 1] ?? 0) + (newDay ? 1 : 0))
    return acc
  }, [])

  return (
    <ol className="relative max-w-3xl pl-7">
      <span aria-hidden className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-neutral-200" />
      {items.map((item, index) => {
        const prev = items[index - 1]
        const newDay = !prev || dateKey(prev.arrive) !== dateKey(item.arrive)
        const day = dayOf[index]
        const hasWarning = item.warnings.length > 0
        const category = findCategory(item.place.category)
        return (
          <Fragment key={item.tripPlace.id}>
            {index > 0 && (
              <li className={cn('flex gap-4 py-1 text-small text-fg-subtle')}>
                <span className={cn(TIME_COL, 'shrink-0')} />
                <span>
                  {item.travelMode === 'walk' ? '徒歩' : '移動'} {formatMinutes(item.travelMinutes)}
                </span>
              </li>
            )}
            {newDay && (
              <li className={index > 0 ? 'pt-12 pb-4' : 'pb-4'}>
                <div className="relative flex items-baseline gap-3">
                  <span aria-hidden className={cn(NODE, 'top-1/2 flex size-5 -translate-y-1/2 items-center justify-center bg-secondary-dark text-caption text-fg-inverse')}>
                    {day}
                  </span>
                  <h2 className="text-heading text-secondary-dark">{formatDate(item.arrive)}</h2>
                  <span className="text-small text-fg-muted">{day}日目</span>
                </div>
              </li>
            )}
            <li id={timelineRowId(item.tripPlace.id)} className="group relative -mx-3 flex items-start gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-neutral-50">
              {/* 行は -mx-3 で左に 12px はみ出しているので、レール(-28px)までは -16px */}
              <span aria-hidden className={cn('absolute top-6 -left-4 size-3 -translate-x-1/2 rounded-full border-2 bg-white', hasWarning ? 'border-primary' : 'border-neutral-300')} />
              <div className={cn(TIME_COL, 'shrink-0 pt-1 text-right tabular-nums')}>
                <div className="text-body text-fg-muted">{formatTime(item.arrive)}</div>
                {item.tripPlace.stay_minutes > 0 && <div className="text-caption text-fg-subtle">{formatTime(item.depart)}</div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="truncate text-title text-fg-strong">{item.place.name}</span>
                  {category && <span className="shrink-0 text-small text-fg-muted">{category.label}</span>}
                </div>
                <div className="mt-1 text-small">
                  <InlineEdit
                    display={item.tripPlace.stay_minutes > 0 ? `滞在 ${formatMinutes(item.tripPlace.stay_minutes)}` : '通過'}
                    value={item.tripPlace.stay_minutes}
                    label={`${item.place.name} の滞在時間(分)`}
                    step={5}
                    onCommit={(v) => onStayChange(item.tripPlace.id, v ?? 0)}
                  />
                </div>
                {hasWarning && (
                  <ul className="mt-2 space-y-1">
                    {item.warnings.map((w) => (
                      <li key={`${item.tripPlace.id}:${w.kind}`} className="flex items-center gap-1 text-small text-primary">
                        <TriangleAlert size={ICON.sm} />
                        {warningLabel(w)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1 pt-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <IconButton icon={ArrowUp} label="上へ" disabled={index === 0} onClick={() => onMove(item.tripPlace.id, -1)} />
                <IconButton icon={ArrowDown} label="下へ" disabled={index === items.length - 1} onClick={() => onMove(item.tripPlace.id, 1)} />
                <IconButton icon={X} label="削除" variant="danger" onClick={() => onRemove(item.tripPlace.id)} />
              </div>
            </li>
          </Fragment>
        )
      })}
      <li className="pt-8">
        <div className="relative flex items-center gap-4">
          <span aria-hidden className={cn(NODE, 'top-1/2 flex size-5 -translate-y-1/2 items-center justify-center bg-secondary text-fg-inverse')}>
            <Check size={ICON.xs} strokeWidth={STROKE.check} />
          </span>
          <span className={cn(TIME_COL, 'shrink-0 text-right text-body text-fg-muted tabular-nums')}>{formatTime(last.depart)}</span>
          <span className="text-body text-fg-muted">最終地点を出発</span>
        </div>
        <div className="mt-8">
          <Button variant="ghost" icon={Plus} onClick={onAdd} className="px-0">
            場所を追加
          </Button>
        </div>
      </li>
    </ol>
  )
}
