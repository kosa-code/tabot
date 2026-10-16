import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

const CONTROL_CLASS =
  'h-9 w-full rounded-lg border border-neutral-300 bg-white px-3 text-[14px] text-ink ' +
  'placeholder:text-neutral-400 focus:border-secondary focus:outline-2 focus:outline-secondary/30'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-neutral-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-neutral-500">{hint}</span>}
    </label>
  )
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL_CLASS, className)} {...rest} />
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL_CLASS, 'appearance-none pr-8', className)} {...rest}>
      {children}
    </select>
  )
}
