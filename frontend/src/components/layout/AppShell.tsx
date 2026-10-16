import type { ReactNode } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

type Props = {
  crumbs: string[]
  children: ReactNode
}

/** サイドバー + 上部バー + 本文の枠 */
export function AppShell({ crumbs, children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar crumbs={crumbs} />
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 px-6 py-6">{children}</main>
      </div>
    </div>
  )
}
