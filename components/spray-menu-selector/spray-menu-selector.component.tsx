import { SprayMenuSelectorProps } from './spray-menu-selector.type'
import clsx from 'clsx'
import { nanoid } from 'nanoid'
import ethIcon from '~~/coins/ethereum-coin.png'
import { IconCoin } from '~~/components/icon-coin'
import { ItemCoin } from '~~/components/item-coin'
import { officialTokenByChain } from '~~/constants'
import { AddressProp } from '~~/types/mode-spray'

const iconClass = 'grayscale hover:grayscale-0 hover:text-white'

export function SprayMenuSelector({
  filterNumber,
  isCustom,
  // networkName,
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
      {/* <span className="text-sm">{`Official tokens on ${networkName}:`}</span> */}
      <ul className="flex gap-2 pb-4 overflow-x-scroll flex-nowrap text-[#888]">
        <ItemCoin
          condition={!isCustom}
          onclick={() => toggleEth(false)}
          classname={clsx(iconClass, { 'grayscale-0': !isCustom })}
        >
          <IconCoin icon={ethIcon} symbol={'ETH'} className={clsx({ 'drop-shadow-[0_0px_5px_#00ff59]': !isCustom })} />
          <div className="text-sm font-chakra">ETH</div>
        </ItemCoin>

        {filteredTokens.map(token => {
          const condition = isCustom && tokenSelected.tokenAddress === token.address
          return (
            <ItemCoin
              condition={condition}
              key={nanoid()}
              onclick={() => {
                setTokenSelected({
                  tokenAddress: token.address as AddressProp,
                  tokenSymbol: token.symbol,
                })
                toggleEth(true)
              }}
              classname={clsx(iconClass, { 'grayscale-0': condition })}
            >
              <IconCoin
                icon={token.icon}
                symbol={token.symbol}
                className={clsx({ 'drop-shadow-[0_0px_5px_#00ff59]': condition })}
              />
              <div className="font-mono text-sm">{token.symbol}</div>
            </ItemCoin>
          )
        })}
      </ul>
    </>
  )
}
