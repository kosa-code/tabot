import { Icon } from '@/components/ui/Icon'
import { ShellCard } from '@/components/ui/ShellCard'
import { formatTime } from '@/lib/format'
import type { TimelineItem } from '@/lib/schedule'

export function WarningsCard({ items }: { items: TimelineItem[] }) {
  const warnings = items.flatMap((item) => item.warnings.map((text) => ({ item, text })))

  return (
    <ShellCard icon="warning" title="注意" subtitle="営業時間と制約のチェック">
      <div className="flex h-full flex-col">
        <div className="text-[28px] leading-none font-semibold tracking-[-0.02em] tabular-nums">
          {warnings.length} <span className="text-[16px] font-medium text-neutral-500">件</span>
        </div>
        {warnings.length === 0 ? (
          <p className="mt-4 text-[13px] text-neutral-500">問題はありません。</p>
        ) : (
          <ul className="mt-4 space-y-2.5 text-[13px]">
            {warnings.slice(0, 4).map(({ item, text }, i) => (
              <li key={i} className="flex items-start gap-2">
                <Icon name="warning" size={15} className="mt-0.5 shrink-0 text-amber-500" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{item.place.name}</div>
                  <div className="text-neutral-500">{text}</div>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-neutral-400 tabular-nums">
                  <Icon name="clock" size={13} />
                  {formatTime(item.arrive)}
                </span>
              </li>
            ))}
            {warnings.length > 4 && <li className="text-[12px] text-neutral-400">ほか {warnings.length - 4} 件</li>}
          </ul>
        )}
      </div>
    </ShellCard>
  )
}
