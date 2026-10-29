import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function Card({ children }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {children}
    </div>
  )
}

export default Card
