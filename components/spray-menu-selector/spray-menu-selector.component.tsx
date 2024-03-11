import { SprayMenuSelectorProps } from './spray-menu-selector.type'
import { nanoid } from 'nanoid'
import { IconCoin } from '~~/components/icon-coin'
import { ItemCoin } from '~~/components/item-coin'
import { officialTokenByChain } from '~~/constants'
import ethIcon from '~~/mode/coins/eth-coin.png'
import { AddressProp } from '~~/types/mode-spray'

export function SprayMenuSelector({
  filterNumber,
  isCustom,
  networkName,
  toggleEth,
  setTokenSelected,
  tokenSelected,
}: SprayMenuSelectorProps) {
  const filteredTokens = officialTokenByChain.filter(token => token.chainId === filterNumber)

  if (!filteredTokens) {
    return <div>No token found for number: {filterNumber}</div>
  }

  return (
    <>
      <span className="text-sm">{`Official tokens on ${networkName}:`}</span>
      <ul className="flex gap-2 pb-4 overflow-x-scroll flex-nowrap text-[#888]">
        <ItemCoin condition={!isCustom} onclick={() => toggleEth(false)}>
          <IconCoin icon={ethIcon} symbol={'ETH'} condition={!isCustom} />
          ETH
        </ItemCoin>

        {filteredTokens.map(token => (
          <ItemCoin
            condition={isCustom && tokenSelected.tokenAddress === token.address}
            key={nanoid()}
            onclick={() => {
              setTokenSelected({
                tokenAddress: token.address as AddressProp,
                tokenSymbol: token.symbol,
              })
              toggleEth(true)
            }}
          >
            <IconCoin
              icon={token.icon}
              symbol={token.symbol}
              condition={isCustom && tokenSelected.tokenAddress === token.address}
            />
            {token.symbol}
          </ItemCoin>
        ))}
      </ul>
    </>
  )
}
