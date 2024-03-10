import { TokenFormatterProps } from './token-formatter.type'
import { formatEther, formatUnits } from 'ethers'

export const tokenFormatter = ({ isCustom, value, tokenDecimals, tokenName = 'ETH' }: TokenFormatterProps) => {
  return isCustom ? formatUnits(value, tokenDecimals) : `${formatEther(value)} ${tokenName}`
}
