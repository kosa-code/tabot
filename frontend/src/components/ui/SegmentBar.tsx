import { cn } from '@/lib/cn'

export type BarSegment = { ratio: number; className: string }

type Props = {
  segments: BarSegment[]
  /** 余りを薄い地で埋める */
  fillRemainder?: boolean
  height?: 'sm' | 'md'
  label?: string
}

/** 横に並ぶ割合のバー。予算の消化や時間の内訳に使う */
export function SegmentBar({ segments, fillRemainder = false, height = 'sm', label }: Props) {
  const used = segments.reduce((n, s) => n + s.ratio, 0)
  return (
    <div className={cn('flex gap-1', height === 'sm' ? 'h-3' : 'h-7')} role="img" aria-label={label}>
      {segments
        .filter((s) => s.ratio > 0)
        .map((s, i) => (
          <div key={i} className={cn('rounded-lg transition-[flex-basis]', s.className)} style={{ flexBasis: `${s.ratio * 100}%` }} />
        ))}
      {fillRemainder && used < 1 && <div className="flex-1 rounded-lg bg-neutral-100" />}
    </div>
  )
}

/** 斜線入りの塗り。進捗を表すときに使う */
export const HATCHED = 'bg-[repeating-linear-gradient(115deg,transparent_0_10px,rgba(255,255,255,0.35)_10px_12px)]'
