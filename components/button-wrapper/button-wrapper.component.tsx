import { ButtonWrapperProps } from './button-wrapper.type'
import clsx from 'clsx'

export function ButtonWrapper({ children, classname }: ButtonWrapperProps) {
  return (
    <>
      <div
        className={clsx(
          'items-center hidden gap-2 px-4 py-3 rounded-sm lg:flex hover:rounded-sm hover:bg-neutral cursor-pointer',
          classname,
        )}
      >
        {children}
      </div>
    </>
  )
}
