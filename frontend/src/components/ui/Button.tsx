import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

const VARIANT: Record<Variant, string> = {
  primary: 'bg-primary text-fg-inverse shadow-[0_1px_2px_rgba(251,133,0,0.35)] hover:bg-primary/90 disabled:bg-neutral-300 disabled:shadow-none',
  secondary: 'bg-white text-fg-strong border border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-50',
  ghost: 'text-fg hover:bg-neutral-100',
  danger: 'text-red-600 hover:bg-red-50',
}

const SIZE: Record<Size, string> = {
  sm: 'h-7 px-3 text-small',
  md: 'h-9 px-4 text-body',
}

export function Button({ variant = 'secondary', size = 'md', className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    />
  )
}
