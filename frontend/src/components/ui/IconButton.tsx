import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'
import { FOCUS_RING, iconSize, type Size } from '@/lib/ui'

export type IconButtonVariant = 'ghost' | 'danger'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: LucideIcon
  /** 読み上げとツールチップに使う。必須 */
  label: string
  size?: Size
  variant?: IconButtonVariant
}

const SIZE: Record<Size, string> = { sm: 'size-7', md: 'size-11' }
const VARIANT: Record<IconButtonVariant, string> = {
  ghost: 'text-fg-subtle hover:bg-paper-deep hover:text-fg-strong',
  danger: 'text-fg-subtle hover:bg-red-50 hover:text-red-600',
}

/** アイコンだけのボタン。文字を持たないので label を必ず付ける */
export function IconButton({ icon: IconComponent, label, size = 'sm', variant = 'ghost', className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn('flex items-center justify-center rounded-full transition-colors disabled:opacity-30', FOCUS_RING, SIZE[size], VARIANT[variant], className)}
      {...rest}
    >
      <IconComponent size={iconSize(size)} />
    </button>
  )
}
