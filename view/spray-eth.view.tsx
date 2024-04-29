import { SetStateAction, useState } from 'react'
import { PushAPI } from '@pushprotocol/restapi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import clsx from 'clsx'
import { format } from 'date-fns'
import { formatEther, parseEther } from 'ethers'
import { useWalletClient } from 'wagmi'
import { Button } from '~~/components/button'
import { BlockchainTransactionsProps, NotificationETHProps } from '~~/components/notifications/notifications.type'
import { getParsedError } from '~~/components/scaffold-eth'
import { SprayEditor } from '~~/components/spray-editor'
import { SprayHeader } from '~~/components/spray-header'
import { SpraySummary } from '~~/components/spray-summary'
import { baseSite } from '~~/constants'
import { TypeInfoToken } from '~~/constants/info-token'
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth'
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork'
import { logger } from '~~/lib'
import { showSuccessModal } from '~~/lib/alerts'
import { getSigner } from '~~/lib/notifications'
import { useGlobalState } from '~~/services/store/store'
import { AddressProp, SprayTransactionProps } from '~~/types/mode-spray'
import { getBlockExplorerTxLink, getTokenAmountByTxn, notification } from '~~/utils/scaffold-eth'

export function SprayETH() {
  const [confirmtnxs, setConfirmtnxs] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alltxns, setAlltxns] = useState<string>('')
  const [everyTxns, setEveryTxns] = useState<SprayTransactionProps[]>([])

  const [totalcost, setTotalcost] = useState(BigInt('0'))

  const { data: dataClient } = useWalletClient()
  const { targetNetwork } = useTargetNetwork()
  const delegate = useGlobalState(({ delegate }) => delegate)

  const { writeAsync: sendEth } = useScaffoldContractWrite({
    contractName: 'ModeSpray',
    functionName: 'disperseEther',
    args: [everyTxns.map(item => item.key), everyTxns.map(item => item.value)],
    value: totalcost,
  })

  const cleanValues = () => {
    setTotalcost(BigInt('0'))

    setEveryTxns([])
    setAlltxns('')
    setConfirmtnxs(false)
  }

  const onChangeValues = (e: { target: { value: SetStateAction<string> } }) => {
    const contentTemp = String(e.target.value)

    contentValidation({ contentfull: contentTemp })
  }

  const contentValidation = ({ contentfull }: { contentfull: string }) => {
    setConfirmtnxs(false)

    try {
      const rows = contentfull.split('\n')

      const allTxns: SprayTransactionProps[] = []

      rows.forEach(element => {
        const onerow = element.split(/[,\s;&=]+/)
        if (onerow[0].startsWith('0x') && onerow[0].length === 42) {
          const weiValue = parseEther(onerow[1])

          allTxns.push({ key: onerow[0], value: weiValue })
        }
      })

      const allowContinue = Object.keys(allTxns).length > 0

      if (!allowContinue) {
        notification.warning('Please check the wallet and amount')
        return
      }

      setConfirmtnxs(allowContinue)
      setEveryTxns(allTxns)
      setAlltxns(contentfull)
      setTotalcost(BigInt(allTxns.reduce((accumulator, tnxz) => accumulator + tnxz.value, BigInt(0))))
    } catch (e) {
      notification.warning('Invalid format')
      logger.error('Invalid format')
      setConfirmtnxs(false)
    }
  }

  const sprayEth = async () => {
    setIsLoading(true)
    if (sendEth) {
      try {
        const data = await sendEth()

        if (!data) return
        cleanValues()

        const blockhash = await getBlockexplorerTxnLink(data)

        showSuccessModal({ infotxns: data, blockhash })

        sendNotifications(data, blockhash as string)
      } catch (e: any) {
        const message = getParsedError(e)
        notification.error(message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText()

    setAlltxns(text)
    contentValidation({ contentfull: text })
  }

  const getBlockexplorerTxnLink = async (address: AddressProp) => {
    if (!dataClient) return
    const network = await dataClient.getChainId()
    const blockhash = getBlockExplorerTxLink(network, address)

    return blockhash
  }

  const sendNotifications = async (hashTxn: AddressProp, blockhash: string) => {
    if (!dataClient) return
    const network = await dataClient.getChainId()

    const linkTx = getTokenAmountByTxn(network, hashTxn, TypeInfoToken.ETH)
    const linkSender = getTokenAmountByTxn(network, hashTxn, TypeInfoToken.ALL_INFO)

    const signer = getSigner(delegate)

    const sprayChannel = await PushAPI.initialize(signer, { env: ENV.STAGING })

    const { items } = await fetch(linkTx).then(res => res.json())
    const itemsSender = await fetch(linkSender).then(res => res.json())

    const recipients = (items as NotificationETHProps[]).map(item => {
      return {
        address: item.to.hash,
        symbol: 'ETH',
        total: formatEther(item.value),
      }
    })

    if (!recipients) {
      logger.log('No sender found to notify')
      return
    }

    const sender = getSender(itemsSender as BlockchainTransactionsProps)

    if (!sender) {
      logger.log('Sender not found')
      return
    }

    const cta = blockhash ?? baseSite
    const senderTitle = `💰 Spray successful ${sender.total} ${sender.symbol}!`
    const senderBody = `[${format(new Date(), 'MMM dd yyyy hh:mm')}]: You have successfully sent  💰 ${sender.total} ${
      sender.symbol
    }!`

    sprayChannel.channel.send([sender.address], {
      notification: {
        title: senderTitle,
        body: senderBody,
      },
      payload: {
        cta,
        title: senderTitle,
        body: senderBody,
      },
    })

    if (!recipients) {
      logger.log('Recipients not found')
      return
    }

    recipients.forEach(recipient => {
      const title = `💰 You just received ${recipient.total} ${recipient.symbol}!`
      const body = `Check your wallet, you just received 💰 ${recipient.total} ${recipient.symbol}. ${format(
        new Date(),
        'dd MMM yyyy hh:mm',
      )}`
      sprayChannel.channel.send([recipient.address], {
        notification: {
          title,
          body,
        },
        payload: {
          cta,
          title,
          body,
        },
      })
    })
  }

  const getSender = (blockfull: BlockchainTransactionsProps) => {
    const sender = {
      address: blockfull.from.hash,
      symbol: 'ETH',
      total: formatEther(blockfull.value),
    }

    return sender
  }

  return (
    <>
      <SprayHeader tokenName={targetNetwork.nativeCurrency.name} />

      <SprayEditor
        textareaValue={alltxns}
        onChangeValues={onChangeValues}
        cleanValues={cleanValues}
        pasteFromClipboard={pasteFromClipboard}
      />

      {confirmtnxs ? (
        <div className="flex flex-col w-full xl:w-[626px] self-center bg-black border border-[#ADB5BD] mx-4 mt-10 mb-20 px-4 md:px-8 pt-10 bg-right-bottom bg-contain bg-no-repeat">
          <div className="flex flex-col px-2 pb-10 text-xs bg-black/40 backdrop-blur-sm">
            <SpraySummary
              transactions={everyTxns}
              isCustom={false}
              tokenDecimals={targetNetwork.nativeCurrency.decimals}
              tokenSymbol={targetNetwork.nativeCurrency.symbol}
              totalCost={totalcost}
            />
            <Button onclick={sprayEth} label="Spray" className={clsx('self-center my-5 w-36')} disabled={isLoading} />
          </div>
        </div>
      ) : null}
    </>
  )
}
