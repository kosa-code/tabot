import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type BadgeTone = 'neutral' | 'primary' | 'secondary' | 'mint' | 'sky' | 'brown' | 'orange'

// 淡い地 + 同系色の文字。アイコンは文字より少し濃くする
const TONE: Record<BadgeTone, { pill: string; icon: string }> = {
  neutral: { pill: 'bg-neutral-100 text-fg', icon: 'text-fg-muted' },
  primary: { pill: 'bg-primary-light/20 text-primary', icon: 'text-primary' },
  secondary: { pill: 'bg-secondary-light/30 text-secondary-dark', icon: 'text-secondary' },
  mint: { pill: 'bg-emerald-50 text-emerald-700', icon: 'text-emerald-500' },
  sky: { pill: 'bg-cyan-50 text-cyan-800', icon: 'text-cyan-600' },
  brown: { pill: 'bg-stone-100 text-amber-900', icon: 'text-amber-800' },
  orange: { pill: 'bg-orange-50 text-orange-600', icon: 'text-orange-500' },
}

type Props = {
  tone?: BadgeTone
  icon?: LucideIcon
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', icon: IconComponent, size = 'sm', className, children }: Props) {
  const t = TONE[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'gap-1 px-2 py-0.5 text-caption' : 'gap-2 px-3 py-1 text-small',
        t.pill,
        className,
      )}
    >
      {IconComponent && <IconComponent size={size === 'sm' ? 12 : 14} strokeWidth={2.5} className={t.icon} />}
      {children}
    </span>
  )
}
