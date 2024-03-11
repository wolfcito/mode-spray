import { TooltipProps } from './tooltip.type'
import clsx from 'clsx'
import { TooltipIcon } from '~~/components/tooltip-icon'

export function Tooltip({ classname, toolTipText }: TooltipProps) {
  return (
    <div className="inline-block">
      <span className="relative inline-block text-blue-500 underline duration-300 group hover:text-red-500">
        <TooltipIcon className="text-base transition duration-300 ease-out opacity-50 cursor-pointer hover:opacity-80" />
        <span
          className={clsx(
            "absolute hidden group-hover:flex -left-5 min-w-[192px] -top-2 -translate-y-full w-auto px-3 py-4 bg-neutral-900 text-left text-[#888] text-xs after:content-[''] after:absolute after:left-7 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-neutral-900",
            classname,
          )}
        >
          <span className="break-words">{toolTipText}</span>
        </span>
      </span>
    </div>
  )
}
