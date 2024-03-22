import { SprayMenuSelectorProps } from './spray-menu-selector.type'
import clsx from 'clsx'
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
        <ItemCoin
          condition={!isCustom}
          onclick={() => toggleEth(false)}
          classname={clsx('grayscale hover:grayscale-0 hover:text-white', {
            'grayscale-0': !isCustom,
          })}
        >
          <IconCoin icon={ethIcon} symbol={'ETH'} />
          <div className="font-mono text-sm">ETH</div>
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
            classname={clsx('grayscale hover:grayscale-0 hover:text-white', {
              'grayscale-0': isCustom && tokenSelected.tokenAddress === token.address,
            })}
          >
            <IconCoin icon={token.icon} symbol={token.symbol} />
            <div className="font-mono text-sm">{token.symbol}</div>
          </ItemCoin>
        ))}
      </ul>
    </>
  )
}
