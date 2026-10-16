import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'
import { FOCUS_RING, iconSize, type Size } from '@/lib/ui'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: Size
  /** 文字の左に置くアイコン。サイズはボタンに合わせて決まる */
  icon?: LucideIcon
}

// 影は付けない。primary は画面に1つだけ
const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-fg-inverse hover:bg-primary/90 disabled:bg-neutral-300',
  secondary: 'border border-neutral-300 text-fg-strong hover:bg-paper-deep',
  ghost: 'text-fg-muted hover:text-fg-strong',
  danger: 'text-red-600 hover:bg-red-50',
}

// sm: 28px / md: 44px
const SIZE: Record<Size, string> = {
  sm: 'h-7 gap-1 px-3 text-small',
  md: 'h-11 gap-2 px-6 text-body',
}

export function Button({ variant = 'secondary', size = 'md', icon: IconComponent, className, type = 'button', children, ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-lg whitespace-nowrap transition-colors',
        FOCUS_RING,
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {IconComponent && <IconComponent size={iconSize(size)} />}
      {children}
    </button>
  )
}
