import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Props = {
  children: ReactNode
  to?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  onClick?: () => void
}

const STYLES = {
  primary:
    'inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300',
  secondary:
    'inline-block rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300',
}

function Button({
  children,
  to,
  type = 'button',
  variant = 'primary',
  disabled,
  onClick,
}: Props) {
  const style = STYLES[variant]
  if (to) {
    return (
      <Link to={to} className={style}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={style}>
      {children}
    </button>
  )
}

export default Button
