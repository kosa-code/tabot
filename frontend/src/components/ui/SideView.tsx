import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

import { IconButton } from '@/components/ui/IconButton'

type Props = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

/** 右から出るサイドビュー。フォームや詳細を画面の文脈を保ったまま開く */
export function SideView({ open, title, description, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="閉じる" onClick={onClose} className="absolute inset-0 animate-fade-in bg-fg-strong/30" />
      <aside
        role="dialog"
        aria-modal
        aria-label={title}
        className="relative flex h-full w-full max-w-md animate-slide-in flex-col border-l border-neutral-200 bg-white shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-title font-semibold text-fg-strong">{title}</h2>
            {description && <p className="text-small text-fg-muted">{description}</p>}
          </div>
          <IconButton icon={X} label="閉じる" onClick={onClose} />
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </aside>
    </div>
  )
}
