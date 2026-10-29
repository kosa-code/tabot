import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function Alert({ children }: Props) {
  return (
    <p
      role="alert"
      className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800"
    >
      {children}
    </p>
  )
}

export default Alert
