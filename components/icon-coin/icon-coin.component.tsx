import Image from 'next/image'
import { IconCoinProps } from './icon-coin.type'
import clsx from 'clsx'

export function IconCoin({ icon, symbol, condition }: IconCoinProps) {
  return (
    <Image
      src={icon}
      alt={`icon of ${symbol}`}
      width={30}
      height={30}
      className={clsx('pr-2 grayscale', { 'grayscale-0': condition })}
    />
  )
}