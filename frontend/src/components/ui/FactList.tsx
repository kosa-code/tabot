import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type Fact = {
  label: string
  value: ReactNode
  /** 値の下に添える補足 */
  note?: ReactNode
}

/** 上下の罫線で挟んだ事実の並び。数字を大きく見せない */
export function FactList({ facts }: { facts: Fact[] }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-10 gap-y-8 border-y border-neutral-200 py-8', facts.length >= 4 && 'md:grid-cols-4')}>
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="text-small text-fg-muted">{f.label}</dt>
          <dd className="mt-2 text-title text-fg-strong tabular-nums">{f.value}</dd>
          {f.note && <dd className="mt-2 text-small text-fg-subtle">{f.note}</dd>}
        </div>
      ))}
    </dl>
  )
}
