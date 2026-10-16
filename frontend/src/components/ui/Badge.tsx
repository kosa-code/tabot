import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { ICON, STROKE, type Size, type Tone } from '@/lib/ui'

// 淡い地 + 同系色の文字
const TONE: Record<Tone, string> = {
  neutral: 'bg-neutral-100 text-fg',
  primary: 'bg-primary-light/20 text-primary',
  secondary: 'bg-secondary-light/30 text-secondary-dark',
}

type Props = {
  tone?: Tone
  icon?: LucideIcon
  size?: Size
  className?: string
  children: ReactNode
}

/** 淡い地のピル。既定は sm。本文の文字に並べるときは md */
export function Badge({ tone = 'neutral', icon: IconComponent, size = 'sm', className, children }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full whitespace-nowrap',
        size === 'sm' ? 'gap-1 px-2 py-0.5 text-caption' : 'gap-1 px-3 py-1 text-small',
        TONE[tone],
        className,
      )}
    >
      {IconComponent && <IconComponent size={size === 'sm' ? ICON.xs : ICON.sm} strokeWidth={STROKE.badge} />}
      {children}
    </span>
  )
}
