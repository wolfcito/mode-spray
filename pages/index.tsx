import { SetStateAction, useState } from 'react'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useWalletClient } from 'wagmi'
import { Button, ButtonLink } from '~~/components/button'
import { MetaHeader } from '~~/components/header'
import { getParsedError } from '~~/components/scaffold-eth'
import { Tooltip } from '~~/components/tooltip'
import { TnxLink } from '~~/components/txn-link'
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth'
import { getBlockExplorerTxLink, notification } from '~~/utils/scaffold-eth'

interface MyDictionaryProps {
  [key: string]: bigint
}

export default function Home() {
  const [confirmtnxs, setConfirmtnxs] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  const [alltxns, setAlltxns] = useState<string>('')
  const [everyTxns, setEveryTxns] = useState<MyDictionaryProps>({})
  const [allAddress, setAllAddress] = useState<string[]>([])
  const [allValues, setAllValues] = useState<bigint[]>([])

  const [totalcost, setTotalcost] = useState(BigInt('0'))
  const [infotxns, setInfotxns] = useState<`0x${string}` | undefined>(undefined)
  const [blockhash, setblockhash] = useState<string>()

  const { data } = useWalletClient()

  const { writeAsync } = useScaffoldContractWrite({
    contractName: 'ModeDisperse',
    functionName: 'disperseEther',
    args: [allAddress, allValues],
    value: totalcost,
  })

  const cleantxns = () => {
    setTotalcost(BigInt('0'))
    setInfotxns(undefined)
    setAllAddress([])
    setAllValues([])

    setEveryTxns({})
    setAlltxns('')
    setConfirmtnxs(false)
    setblockhash('')
  }

  const updateValue = (e: { target: { value: SetStateAction<string> } }) => {
    const contentTemp = String(e.target.value)

    contentValidation({ contentfull: contentTemp })
  }

  const contentValidation = ({ contentfull }: { contentfull: string }) => {
    setAllAddress([])
    setAllValues([])
    setConfirmtnxs(false)
    setblockhash('')

    try {
      const rows = contentfull.split('\n')
      const allTxns: MyDictionaryProps = {}
      rows.forEach(element => {
        const onerow = element.split(/[,\s;]+/)
        if (onerow[0].startsWith('0x') && onerow[0].length === 42) {
          const weiValue = ethers.parseEther(onerow[1])
          allTxns[onerow[0]] = weiValue
        }
      })

      const allowContinue = Object.keys(allTxns).length > 0

      if (!allowContinue) {
        notification.warning('Please check the wallet and amount')
        return
      }

      for (const [addres, amount] of Object.entries(allTxns)) {
        allAddress.push(addres)
        allValues.push(amount)
      }

      setConfirmtnxs(allowContinue)
      setEveryTxns(allTxns)
      setAlltxns(contentfull)
      setTotalcost(Object.values(allTxns).reduce((a, b) => a + b, BigInt(0)))
    } catch (e) {
      console.error('Invalid format')
      setConfirmtnxs(false)
    }
  }

  const sprayEth = async () => {
    setLoading(true)
    if (writeAsync) {
      try {
        const data = await writeAsync()

        if (!data) return
        cleantxns()
        setInfotxns(data)
        getBlockexplorerTxnLink(data)
      } catch (e: any) {
        const message = getParsedError(e)
        notification.error(message)
      } finally {
        setLoading(false)
      }
    }
  }

  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText()

    setAlltxns(text)
    contentValidation({ contentfull: text })
  }

  const getBlockexplorerTxnLink = async (address: string) => {
    if (!data) return
    const network = await data.getChainId().then(chainId => chainId)
    const linkTx = getBlockExplorerTxLink(network, address)
    setblockhash(linkTx)
  }

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center w-full xl:w-[626px] self-center bg-black border border-[#ADB5BD] mx-4 mt-20 md:mt-10 px-4 md:px-8  py-10">
        <div className="w-full p-2 rounded-t-3xl bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col pb-2 space-y-3 rounded-3xl">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="p-0 m-0 text-2xl font-semibold font-chakra">
                  Account Panel <Tooltip toolTipText="This is some extra useful information" />
                </h2>
                <p className="font-mono text-xs font-normal m-0 text-[#4c4c4c]">
                  one address and amount[ETH] on each line
                </p>
              </div>
              <ButtonLink
                onclick={pasteFromClipboard}
                label="Paste from Clipboard"
                className="text-xs text-[#4c4c4c]"
              />
            </div>

            <textarea
              value={alltxns}
              onChange={updateValue}
              placeholder="0x6a22F6308a9a8D40eb7585F16BBd73913cF98633 0.001"
              className="w-full rounded-lg text-sm textarea textarea-bordered textarea-primary textarea-xs min-h-[135px] font-mono"
            ></textarea>
            <ButtonLink
              onclick={cleantxns}
              label="clear"
              className={clsx(!alltxns && 'opacity-50 disabled', alltxns && 'hover:text-neutral-content')}
            />
          </div>
        </div>

        <TnxLink infotxns={infotxns} blockhash={blockhash} />
      </div>
      {confirmtnxs ? (
        <div className="flex flex-col w-full xl:w-[626px] self-center bg-black border border-[#ADB5BD] mx-4 mt-10 mb-20 px-4 md:px-8 pt-10 bg-right-bottom bg-contain bg-no-repeat">
          <div className="flex flex-col px-2 pb-10 text-xs bg-black/40 backdrop-blur-sm">
            <p className="text-lg font-semibold font-chakra">Confirm your Transactions</p>
            <div className="overflow-x-auto">
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
                  {Object.entries(everyTxns).map(({ '0': address, '1': amount }, index) => (
                    <tr key={`${address}-row`} className="border select-none hover:bg-neutral-900">
                      <td className="px-3 py-4 font-medium text-center border-r whitespace-nowrap border-neutral-500">
                        {index + 1}
                      </td>
                      <td className="py-4 pl-3 pr-4 font-mono text-center border-r border-neutral-500">{address}</td>
                      <td className="py-4 pl-3 pr-4 font-mono text-center border-neutral-500">{`${ethers.formatEther(
                        amount,
                      )} ETH`}</td>
                    </tr>
                  ))}
                  <tr className="border select-none font-mono text-sm font-semibold text-right border-t border-primary-content bg-[#e0fe000a]">
                    <td
                      colSpan={3}
                      className="pt-2 pb-3 pr-4 text-neutral-content"
                    >{`Total amount: ${ethers.formatEther(totalcost)} ETH`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button onclick={sprayEth} label="Spray" className={clsx('self-center my-5 w-36')} disabled={isLoading} />
          </div>
        </div>
      ) : null}
    </>
  )
}
