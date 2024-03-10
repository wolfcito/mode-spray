import { StaticImageData } from 'next/image'

export interface OfficialTokensProps {
  chainId: number
  symbol: string
  address: string
  icon: StaticImageData
}
