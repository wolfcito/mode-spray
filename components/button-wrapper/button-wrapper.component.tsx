import { ButtonWrapperProps } from './button-wrapper.type'
import clsx from 'clsx'

export function ButtonWrapper({ children, classname }: ButtonWrapperProps) {
  return (
    <>
      <div
        className={clsx(
          'items-center hidden gap-2 px-4 py-3 rounded-sm lg:flex hover:rounded-sm hover:bg-neutral',
          classname,
        )}
      >
        {children}
      </div>
      <div className="hidden h-full text-black border-l border-neutral lg:flex">.</div>
    </>
  )
}
