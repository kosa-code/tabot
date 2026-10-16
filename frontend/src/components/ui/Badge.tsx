import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'accent' | 'warning'

const TONE: Record<Tone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  accent: 'bg-accent-soft text-accent',
  warning: 'bg-amber-50 text-amber-800',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', TONE[tone])}>
      {children}
    </span>
  )
}
