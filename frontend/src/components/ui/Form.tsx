import type { FormHTMLAttributes, ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/** 項目を縦に並べるフォーム。SideView の中では操作が下端に付く */
export function Form({ children, className, ...rest }: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className={cn('flex min-h-full flex-col gap-8', className)} {...rest}>
      {children}
    </form>
  )
}

type ActionsProps = {
  submitLabel: string
  onCancel?: () => void
  cancelLabel?: string
  children?: ReactNode
}

/** フォーム末尾の操作。左にキャンセル、右に送信(primary) */
export function FormActions({ submitLabel, onCancel, cancelLabel = 'キャンセル', children }: ActionsProps) {
  return (
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-200 pt-6">
      <div>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <Button variant="primary" type="submit">
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
