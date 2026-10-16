import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

const VARIANT: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent/90 disabled:bg-neutral-300',
  secondary: 'bg-white text-ink border border-neutral-300 hover:bg-neutral-50',
  ghost: 'text-neutral-600 hover:bg-neutral-100',
  danger: 'text-red-700 hover:bg-red-50',
}

const SIZE: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-[12px]',
  md: 'h-9 px-4 text-[14px]',
}

export function Button({ variant = 'secondary', size = 'md', className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    />
  )
}
