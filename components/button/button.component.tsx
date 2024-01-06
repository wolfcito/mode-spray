import { ButtonProps } from './button.type'
import clsx from 'clsx'

export function Button({ onclick, label = 'button', className, disabled }: ButtonProps) {
  return (
    <button
      onClick={onclick}
      className={clsx(
        'btn bg-neutral-content rounded-md text-neutral hover:bg-neutral-content disabled:bg-neutral-content/50 disabled:text-neutral',
        className,
      )}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
