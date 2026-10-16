import { useEffect, type ReactNode } from 'react'

import { X } from 'lucide-react'

import { ICON } from '@/lib/ui'


type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Dialog({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-title font-semibold text-fg-strong">{title}</h2>
          <button type="button" onClick={onClose} aria-label="閉じる" className="rounded-lg p-1 text-fg-muted hover:bg-neutral-100">
            <X size={ICON.md} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
