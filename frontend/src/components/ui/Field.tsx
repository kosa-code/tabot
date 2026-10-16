import { ChevronDown } from 'lucide-react'
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { ICON, type Size } from '@/lib/ui'

type FieldContextValue = { id: string; describedBy?: string; invalid: boolean }
const FieldContext = createContext<FieldContextValue | null>(null)

type FieldProps = {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

/** ラベル・補足・エラーを持つ入力欄の枠。中に Input / Select を置く */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="block text-small text-fg-muted">
        {label}
      </label>
      <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error) }}>{children}</FieldContext.Provider>
      {error ? (
        <p id={errorId} className="mt-2 text-small text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="mt-2 text-small text-fg-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

// 下線型。枠で囲まず、下の罫線だけで入力欄を示す
const CONTROL =
  'w-full rounded-none border-0 border-b bg-transparent px-0 text-fg-strong placeholder:text-fg-subtle ' +
  'border-neutral-300 focus:border-secondary-dark focus:outline-none aria-invalid:border-red-500'
const CONTROL_SIZE: Record<Size, string> = {
  sm: 'h-7 text-body',
  md: 'h-11 text-title',
}

function useFieldAttrs(props: { id?: string }) {
  const ctx = useContext(FieldContext)
  return {
    id: props.id ?? ctx?.id,
    'aria-describedby': ctx?.describedBy,
    'aria-invalid': ctx?.invalid || undefined,
  }
}

type InputProps = Omit<ComponentProps<'input'>, 'size'> & { size?: Size }

export function Input({ className, size = 'md', ...rest }: InputProps) {
  const attrs = useFieldAttrs(rest)
  return <input {...attrs} className={cn(CONTROL, CONTROL_SIZE[size], className)} {...rest} />
}

type SelectProps = Omit<ComponentProps<'select'>, 'size'> & { size?: Size }

export function Select({ className, size = 'md', children, ...rest }: SelectProps) {
  const attrs = useFieldAttrs(rest)
  return (
    <span className="relative block">
      <select {...attrs} className={cn(CONTROL, CONTROL_SIZE[size], 'appearance-none pr-8', className)} {...rest}>
        {children}
      </select>
      <ChevronDown size={ICON.md} aria-hidden className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-fg-subtle" />
    </span>
  )
}

/** 2つの入力欄を横に並べる */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-8">{children}</div>
}
