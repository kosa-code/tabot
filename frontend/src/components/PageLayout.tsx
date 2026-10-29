import type { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

function PageLayout({ title, children }: Props) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 text-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1>
      {children}
    </main>
  )
}

export default PageLayout
