import { Address } from 'viem'
import { useAccountBalance } from '~~/hooks/scaffold-eth'
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork'

type BalanceProps = {
  address?: Address
  className?: string
}

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const Balance = ({ address, className = '' }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork()
  const { balance, price, isError, isLoading, onToggleBalance, isEthBalance } = useAccountBalance(address)

  if (!address || isLoading || balance === null) {
    return (
      <div className="flex space-x-4 animate-pulse">
        <div className="w-6 h-6 rounded-md bg-slate-300"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 rounded w-28 bg-slate-300"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    )
  }

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-mono items-center hover:bg-transparent ${className}`}
      onClick={onToggleBalance}
    >
      <div className="flex items-center justify-center w-full">
        {isEthBalance ? (
          <>
            <span>{balance?.toFixed(4)}</span>
            <span className="text-[0.8em] font-bold ml-1">{targetNetwork.nativeCurrency.symbol}</span>
          </>
        ) : (
          <>
            <span className="text-[0.8em] font-bold mr-1">$</span>
            <span>{(balance * price).toFixed(2)}</span>
          </>
        )}
      </div>
    </button>
  )
}
