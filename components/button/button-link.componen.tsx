import { ButtonProps } from './button.type'

export function ButtonLink({
  onclick,
  label = 'button',
  className = 'text-xs text-right underline text-accent underline-offset-2 hover:text-neutral-content',
}: ButtonProps) {
  return (
    <button className={className} onClick={onclick}>
      {label}
    </button>
  )
}
