import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Props = {
  children: ReactNode
  to?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

const STYLE =
  'inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300'

function Button({ children, to, type = 'button', disabled, onClick }: Props) {
  if (to) {
    return (
      <Link to={to} className={STYLE}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={STYLE}>
      {children}
    </button>
  )
}

export default Button
