import { ButtonWrapperProps } from './button-wrapper.type'
import clsx from 'clsx'

export function ButtonWrapper({ children, classname, onclick, isVisible = true }: ButtonWrapperProps) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => {}
  return (
    <div
      className={clsx(
        'items-center gap-2 px-4 py-3 rounded-sm md:flex hover:rounded-sm hover:bg-neutral cursor-pointer',
        classname,
        { hidden: isVisible },
      )}
      onClick={onclick ? onclick : noop}
      role="button"
    >
      {children}
    </div>
  )
}
