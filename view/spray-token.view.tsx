import { SetStateAction, useState } from 'react'
import { PushAPI } from '@pushprotocol/restapi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import clsx from 'clsx'
import { format } from 'date-fns'
import { formatUnits, parseUnits } from 'ethers'
import { erc20ABI, useWalletClient } from 'wagmi'
import { Button } from '~~/components/button'
import { TokenTransfer } from '~~/components/notifications/notifications.type'
import { getParsedError } from '~~/components/scaffold-eth'
import { SprayEditor } from '~~/components/spray-editor'
import { SprayHeader } from '~~/components/spray-header'
import { SpraySummary } from '~~/components/spray-summary'
import { Steps } from '~~/components/steps'
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from '~~/hooks/scaffold-eth'
import { logger } from '~~/lib'
import { showSuccessModal } from '~~/lib/alerts'
import { getSigner } from '~~/lib/notifications'
import { useGlobalState } from '~~/services/store/store'
import { AddressProp, SprayTransactionProps, TokenSelectedProps, sprayStatus } from '~~/types/mode-spray'
import { getBlockExplorerTxLink, getTokenAmountByTxn, notification } from '~~/utils/scaffold-eth'

export function SprayToken({ tokenSelected }: { tokenSelected: TokenSelectedProps }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmtnxs, setConfirmtnxs] = useState<boolean>(false)
  const [readyToSpray, setReadyToSpray] = useState<sprayStatus>('default')
  const [readyToNotify, setNeadyToNotify] = useState<sprayStatus>('default')

  const [alltxns, setAlltxns] = useState<string>('')

  const [everyTxns, setEveryTxns] = useState<SprayTransactionProps[]>([])

  const [totalcost, setTotalcost] = useState(BigInt('0'))

  const { data: dataClient } = useWalletClient()
  const { data: deployedInfo } = useDeployedContractInfo('ModeSpray')

  const delegate = useGlobalState(({ delegate }) => delegate)

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
          const weiValue = parseUnits(onerow[1], decimalsToken)

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

      setConfirmtnxs(false)
    }
  }

  const { data: decimalsToken } = useScaffoldContractRead({
    contractName: 'USDC',
    functionName: 'decimals',
    abi: erc20ABI,
    address: tokenSelected.tokenAddress,
  })

  const { writeAsync: approval, isError: isAmountApprovedError } = useScaffoldContractWrite({
    contractName: 'USDC',
    functionName: 'approve',
    abi: erc20ABI,
    address: tokenSelected.tokenAddress,
    args: [deployedInfo?.address, totalcost],
  })

  const { writeAsync: sendToken, isError: isSendTokenError } = useScaffoldContractWrite({
    contractName: 'ModeSpray',
    functionName: 'disperseToken',
    args: [tokenSelected.tokenAddress, everyTxns.map(item => item.key), everyTxns.map(item => item.value)],
  })

  const approveTransaction = async () => {
    setIsLoading(true)

    try {
      const approvalResult = await approval()

      if (!approvalResult) {
        return 'default' as sprayStatus
      }
      return 'success' as sprayStatus
    } catch (e: any) {
      const message = getParsedError(e)
      notification.error(message)
      return 'error' as sprayStatus
    } finally {
      setIsLoading(false)
    }
  }

  const sprayToken = async () => {
    setIsLoading(true)
    if (sendToken) {
      try {
        const data = await sendToken()
        if (!data) return
        cleanValues()

        const blockhash = await getBlockexplorerTxnLink(data)

        showSuccessModal({ infotxns: data, blockhash: blockhash })
        setNeadyToNotify('success')
        sendNotifications(data)

        return 'success' as sprayStatus
      } catch (e: any) {
        const message = getParsedError(e)
        notification.error(message)
        setIsLoading(false)
        setNeadyToNotify('error')
      }
    }
  }

  const sprayit = async () => {
    setIsLoading(true)
    setReadyToSpray('loading')
    const statusApproval = await approveTransaction()
    if (statusApproval !== 'success' || isAmountApprovedError) {
      setReadyToSpray('default')
      setIsLoading(false)
      return
    }
    setReadyToSpray('success')

    setNeadyToNotify('loading')
    if ((await sprayToken()) !== 'success' || isSendTokenError) {
      setNeadyToNotify('default')
      setIsLoading(false)
      return
    }
    setNeadyToNotify('default')

    setIsLoading(false)
  }

  const sendNotifications = async (hashTxn: AddressProp) => {
    if (!dataClient) return
    const network = await dataClient.getChainId()

    const linkTx = getTokenAmountByTxn(network, hashTxn)

    const signer = getSigner(delegate)

    const sprayChannel = await PushAPI.initialize(signer, { env: ENV.STAGING })

    const { items } = await fetch(linkTx).then(res => res.json())
    if (!items || !items.length) {
      logger.log('No transactions found.')
      return
    }

    const forNotifications = (items as TokenTransfer[]).map(token => {
      return {
        address: token.to.hash,
        symbol: token.token.symbol,
        total: formatUnits(BigInt(token.total.value), Number(token.total.decimals)),
      }
    })

    if (!forNotifications) {
      logger.log('No sender found to notify')
      return
    }

    const sender = forNotifications[0]
    if (!sender) {
      logger.log('Sender not found')
      return
    }

    const cta = 'https://spray.mundovirtual.solutions/'
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

    const recipients = forNotifications.slice(1)

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

  if (!decimalsToken) return

  return (
    <>
      <SprayHeader tokenName={tokenSelected.tokenSymbol} />

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
              isCustom={true}
              tokenDecimals={decimalsToken}
              tokenSymbol={tokenSelected.tokenSymbol}
              totalCost={totalcost}
            />

            <Steps
              show={isLoading}
              condition={readyToSpray === 'success'}
              successMessage="Approved amount for spray"
              loadingMessage="Approving amount for spray"
            />

            <Steps
              show={isLoading}
              condition={readyToNotify === 'success'}
              successMessage="Successful Spray"
              loadingMessage="Spraying tokens"
            />

            <Button
              onclick={sprayit}
              label="Spray Token"
              className={clsx('self-center my-5 w-36')}
              disabled={isLoading}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
