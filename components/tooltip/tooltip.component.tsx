import { Icon } from '../Icon'
import { tooltipProps } from './tooltip.type'
import clsx from 'clsx'

export function Tooltip({ className, toolTipText }: tooltipProps) {
  return (
    <div className="inline-block">
      <span className="group relative inline-block text-blue-500 underline hover:text-red-500 duration-300">
        <Icon className="text-base opacity-50 hover:opacity-80 transition ease-out cursor-pointer duration-300" />
        <span
          className={clsx(
            "absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-3 py-4 bg-neutral-900 text-left text-[#888] text-xs after:content-[''] after:absolute after:left-7 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-neutral-900",
            className,
          )}
        >
          {toolTipText}
        </span>
      </span>
    </div>
  )
}
