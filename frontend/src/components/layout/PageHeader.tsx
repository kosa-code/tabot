import type { ReactNode } from 'react'

type Props = {
  title: string
  /** 見出しの下の一行。アイコンは添えない */
  meta?: string
  /** メタ行の下に置く操作。primary は1つまで */
  actions?: ReactNode
}

/** 画面のヒーロー。旅行名が画面で唯一の最大文字 */
export function PageHeader({ title, meta, actions }: Props) {
  return (
    <div>
      <h1 className="max-w-3xl text-display text-fg-strong">{title}</h1>
      {meta && <p className="mt-4 text-body text-fg-muted">{meta}</p>}
      {actions && <div className="mt-8 flex items-center gap-6">{actions}</div>}
    </div>
  )
}
