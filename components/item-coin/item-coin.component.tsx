import { ItemCoinProps } from './item-coin.type'
import clsx from 'clsx'

export function ItemCoin({ condition, onclick, children, classname }: ItemCoinProps) {
  return (
    <li
      className={clsx(
        'flex rounded-sm hover:rounded-sm min-w-24 py-3 hover:cursor-pointer justify-center items-center flex-col ease-in-out duration-300',
        {
          'text-neutral-content skeleton rounded-sm': condition,
        },
        classname,
      )}
      onClick={onclick}
    >
      {children}
    </li>
  )
}
