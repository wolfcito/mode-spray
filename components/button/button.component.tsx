import { ButtonProps } from './button.type'
import clsx from 'clsx'
import { LoadingAnimatedIcon } from '~~/icons'

export function Button({ onclick, label = 'button', className, disabled }: ButtonProps) {
  return (
    <button
      onClick={onclick}
      className={clsx(
        'btn bg-neutral-content rounded-sm text-neutral hover:bg-neutral-content disabled:bg-neutral-content/50 disabled:text-neutral w-full mb-7',
        className,
      )}
      disabled={disabled}
    >
      {disabled ? <LoadingAnimatedIcon /> : label}
    </button>
  )
}
