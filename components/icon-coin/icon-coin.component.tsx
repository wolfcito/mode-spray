import Image from 'next/image'
import { IconCoinProps } from './icon-coin.type'

export function IconCoin({ icon, symbol, className }: IconCoinProps) {
  return <Image src={icon} alt={`icon of ${symbol}`} width={48} height={48} className={className} />
}
