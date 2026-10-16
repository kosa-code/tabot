import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

import { IconButton } from '@/components/ui/IconButton'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/**
 * 右から出るサイドビュー。ネイティブ <dialog> に乗せ、フォーカスの移動・戻し・閉じ込め、
 * Esc、背景の無効化はブラウザに任せる。影を使うのはこの部品だけ
 */
export function SideView({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onCloseRef.current()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseRef.current()
      }}
      className={[
        // <dialog> の既定(中央・自動余白)を上書きして右端に貼る
        'fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-lg',
        // 閉じているときは非表示(display を上書きしないよう open: 付きで指定する)
        'hidden open:flex flex-col bg-white p-0 text-fg shadow-xl',
        'open:animate-slide-in motion-reduce:animate-none',
        'backdrop:bg-fg-strong/20 backdrop:animate-fade-in motion-reduce:backdrop:animate-none',
      ].join(' ')}
    >
      <header className="flex items-center justify-between gap-4 px-10 pt-10 pb-8">
        <h2 className="text-heading text-secondary-dark">{title}</h2>
        <IconButton icon={X} label="閉じる" size="md" onClick={onClose} />
      </header>
      <div className="flex flex-1 flex-col overflow-y-auto px-10 pb-10">{children}</div>
    </dialog>
  )
}
