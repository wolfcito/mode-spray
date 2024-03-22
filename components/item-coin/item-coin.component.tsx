import { ItemCoinProps } from './item-coin.type'
import clsx from 'clsx'

export function ItemCoin({ condition, onclick, children, classname }: ItemCoinProps) {
  return (
    <li
      className={clsx(
        'flex rounded-sm hover:rounded-sm min-w-24 hover:bg-neutral py-1 hover:cursor-pointer justify-center items-center flex-col',
        {
          'text-neutral-content skeleton rounded-sm bg-neutral': condition,
        },
        classname,
      )}
      onClick={onclick}
    >
      {children}
    </li>
  )
}
