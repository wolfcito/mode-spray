import { TokenFormatterProps } from './token-formatter.type'
import { formatEther, formatUnits } from 'ethers'

export const tokenFormatter = ({ isCustom, value, tokenDecimals, tokenSymbol = 'ETH' }: TokenFormatterProps) => {
  return isCustom ? `${formatUnits(value, tokenDecimals)} ${tokenSymbol}` : `${formatEther(value)} ${tokenSymbol}`
}
