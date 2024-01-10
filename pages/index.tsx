import { SetStateAction, useState } from 'react'
import { ethers } from 'ethers'
import { Button, ButtonLink } from '~~/components/button'
import { MetaHeader } from '~~/components/header'
import { getParsedError } from '~~/components/scaffold-eth'
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth'
import { notification } from '~~/utils/scaffold-eth'

interface MyDictionaryProps {
  [key: string]: bigint
}

export default function Home() {
  const [confirmtnxs, setConfirmtnxs] = useState<boolean>(false)
  const [alltxns, setAlltxns] = useState<string>('')
  const [everyTxns, setEveryTxns] = useState<MyDictionaryProps>({})
  const [allAddress, setAllAddress] = useState<string[]>([])
  const [allValues, setAllValues] = useState<bigint[]>([])

  const [totalcost, setTotalcost] = useState(BigInt('0'))

  const { writeAsync, isLoading, isSuccess } = useScaffoldContractWrite({
    contractName: 'ModeDisperse',
    functionName: 'disperseEther',
    args: [allAddress, allValues],
    value: totalcost,
  })

  const cleantxns = () => {
    setTotalcost(BigInt('0'))

    setAllAddress([])
    setAllValues([])

    setEveryTxns({})
    setAlltxns('')
    setConfirmtnxs(false)
  }

  const updateValue = (e: { target: { value: SetStateAction<string> } }) => {
    const contentTemp = String(e.target.value)

    contentValidation({ contentfull: contentTemp })
  }

  const contentValidation = ({ contentfull }: { contentfull: string }) => {
    setAllAddress([])
    setAllValues([])
    setConfirmtnxs(false)

    try {
      const rows = contentfull.split('\n')
      const allTxns: MyDictionaryProps = {}
      rows.forEach(element => {
        const onerow = element.split(/[,\s;]+/)
        if (onerow[0].startsWith('0x') && onerow[0].length === 42) {
          const weiValue = ethers.parseEther(onerow[1])
          allTxns[onerow[0]] = weiValue //BigInt(onerow[1])
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
    if (writeAsync) {
      try {
        writeAsync()
        if (isSuccess) cleantxns()
      } catch (e: any) {
        const message = getParsedError(e)
        notification.error(message)
        setConfirmtnxs(false)
      }
    }
  }

  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText()

    setAlltxns(text)
    contentValidation({ contentfull: text })
  }

  return (
    <>
      <MetaHeader />

      <div className="flex flex-col items-center flex-grow w-full xl:w-[626px] pt-10 self-center">
        <div className="w-full p-5 md:border-t md:border-r border-t-secondary-content rounded-t-3xl bg-neutral">
          <div className="flex flex-col space-y-3 py-7 rounded-3xl">
            <ButtonLink onclick={pasteFromClipboard} label="Paste from Clipboard" />

            <textarea
              value={alltxns}
              onChange={updateValue}
              placeholder="0x6a22F6308a9a8D40eb7585F16BBd73913cF98633 100000000000000"
              className="w-full rounded-lg textarea textarea-bordered textarea-primary textarea-sm min-h-[135px]"
            ></textarea>
            <ButtonLink onclick={cleantxns} label="clear" />
          </div>
        </div>

        {confirmtnxs ? (
          <div className="flex flex-col w-full px-5 pb-10 bg-neutral">
            <p>Confirm your transactions</p>
            <table className="table table-zebra">
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
                    <th>{index + 1}</th>
                    <td>{address}</td>
                    <td className="text-right">{`${ethers.formatEther(amount)} ETH`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-2 pb-3 pr-4 text-sm font-semibold text-right border-t border-secondary text-neutral-content">
              {`Total amount: ${ethers.formatEther(totalcost)} ETH`}
            </div>
            <Button onclick={sprayEth} label="Spray" className="self-center my-5 w-36" disabled={isLoading} />
          </div>
        ) : null}
      </div>
    </>
  )
}
