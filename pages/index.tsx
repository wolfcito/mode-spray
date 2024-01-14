import { SetStateAction, useState } from 'react'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useWalletClient } from 'wagmi'
import { Button, ButtonLink } from '~~/components/button'
import { MetaHeader } from '~~/components/header'
import { getParsedError } from '~~/components/scaffold-eth'
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

      <div className="flex flex-col items-center flex-grow w-full xl:w-[626px] self-center">
        <div className="w-full p-2 rounded-t-3xl bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col space-y-3 pb-7 rounded-3xl">
            <ButtonLink onclick={pasteFromClipboard} label="Paste from Clipboard" className="text-neutral-content" />

            <textarea
              value={alltxns}
              onChange={updateValue}
              placeholder="0x6a22F6308a9a8D40eb7585F16BBd73913cF98633 0.001"
              className="w-full rounded-lg textarea textarea-bordered textarea-primary textarea-xs min-h-[135px] font-mono"
            ></textarea>
            <ButtonLink onclick={cleantxns} label="clear" />
          </div>
        </div>

        <TnxLink infotxns={infotxns} blockhash={blockhash} />

        {confirmtnxs ? (
          <div className="flex flex-col w-full bg-[url('/mode/mode-hand.png')] bg-right-bottom bg-contain bg-no-repeat">
            <div className="flex flex-col px-2 pb-10 text-xs bg-black/40 backdrop-blur-sm">
              <p className="font-bold">Confirm your transactions</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th>txn</th>
                      <th>address</th>
                      <th className="text-right">amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(everyTxns).map(({ '0': address, '1': amount }, index) => (
                      <tr key={`${address}-row`}>
                        <td className="p-2">{index + 1}</td>
                        <td className="font-mono">{address}</td>
                        <td className="font-mono text-right">{`${ethers.formatEther(amount)} ETH`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pt-2 pb-3 pr-4 font-mono text-sm font-semibold text-right border-t border-primary-content text-neutral-content">
                {`Total amount: ${ethers.formatEther(totalcost)} ETH`}
              </div>
              <Button onclick={sprayEth} label="Spray" className={clsx('self-center my-5 w-36')} disabled={isLoading} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
