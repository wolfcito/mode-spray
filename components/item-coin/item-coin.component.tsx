import { ItemCoinProps } from './item-coin.type'
import clsx from 'clsx'

export function ItemCoin({ condition, onclick, children }: ItemCoinProps) {
  return (
    <li className="flex rounded-sm hover:rounded-sm min-w-24" onClick={onclick}>
      <a
        className={clsx('flex items-center justify-center px-4 hover:cursor-pointer py-1', {
          'text-neutral-content skeleton rounded-sm w-full': condition,
        })}
      >
        {children}
      </a>
    </li>
  )
}
