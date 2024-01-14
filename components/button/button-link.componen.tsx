import { ButtonProps } from './button.type'
import clsx from 'clsx'

export function ButtonLink({ onclick, label = 'button', className }: ButtonProps) {
  return (
    <button
      className={clsx(
        'text-xs text-right underline text-accent underline-offset-2 hover:text-neutral-content',
        className,
      )}
      onClick={onclick}
    >
      {label}
    </button>
  )
}
