import { SpraySummaryProps } from './spray-summary.type'
import clsx from 'clsx'
import { formatEther, formatUnits } from 'ethers'
import { nanoid } from 'nanoid'
import { tokenFormatter } from '~~/lib'

export function SpraySummary({ transactions, isCustom, tokenDecimals, tokenSymbol, totalCost }: SpraySummaryProps) {
  return (
    <>
      <p className="text-lg font-semibold font-chakra">Confirm your Transactions</p>
      <div className="mb-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className={clsx('border')}>
            <tr>
              <th scope="col" className="py-4 pl-3 pr-4 text-center border-r">
                Txn
              </th>
              <th scope="col" className="px-6 py-4 border-r">
                Address
              </th>
              <th scope="col" className="px-4 py-4">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(({ key: address, value: amount }, index) => (
              <tr key={`${nanoid()}-row`} className="border select-none hover:bg-neutral-900">
                <td className="px-3 py-4 font-medium text-center border-r whitespace-nowrap border-neutral-500">
                  {index + 1}
                </td>
                <td className="py-4 pl-3 pr-4 font-mono text-center border-r border-neutral-500">{address}</td>
                <td className="py-4 pl-3 pr-4 font-mono text-center border-neutral-500">{`${
                  isCustom ? formatUnits(amount, tokenDecimals) : formatEther(amount)
                } ${tokenSymbol}`}</td>
              </tr>
            ))}
            <tr className="border select-none font-mono text-sm font-semibold text-right border-t border-primary-content bg-[#e0fe000a]">
              <td colSpan={3} className="pt-2 pb-3 pr-4 text-neutral-content">{`Total amount: ${tokenFormatter({
                isCustom,
                value: totalCost,
                tokenDecimals,
                tokenSymbol,
              })}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
