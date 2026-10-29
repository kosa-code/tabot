import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Props = {
  title: string
  back?: { to: string; label: string }
  description?: string
  action?: ReactNode
  children: ReactNode
}

function PageLayout({ title, back, description, action, children }: Props) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 text-gray-800">
      {back && (
        <Link to={back.to} className="text-sm text-blue-600 hover:underline">
          ← {back.label}
        </Link>
      )}
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {action}
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </main>
  )
}

export default PageLayout
