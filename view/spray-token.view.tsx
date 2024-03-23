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
import { TnxLink } from '~~/components/txn-link'
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from '~~/hooks/scaffold-eth'
import { logger } from '~~/lib'
import { getSigner } from '~~/lib/notifications'
import { useGlobalState } from '~~/services/store/store'
import { AddressProp, SprayTransactionProps, TokenSelectedProps } from '~~/types/mode-spray'
import { getBlockExplorerTxLink, getTokenAmountByTxn, notification } from '~~/utils/scaffold-eth'

export function SprayToken({ tokenSelected }: { tokenSelected: TokenSelectedProps }) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [readyToSpray, setReadyToSpray] = useState<boolean>(false)
  const [confirmtnxs, setConfirmtnxs] = useState<boolean>(false)

  const [alltxns, setAlltxns] = useState<string>('')

  const [everyTxns, setEveryTxns] = useState<SprayTransactionProps[]>([])

  const [totalcost, setTotalcost] = useState(BigInt('0'))
  const [infotxns, setInfotxns] = useState<AddressProp | undefined>(undefined)
  const [blockhash, setblockhash] = useState<string>()

  const { data: dataClient } = useWalletClient()
  const { data: deployedInfo } = useDeployedContractInfo('ModeSpray')

  // const datosClient = useWalletClient()
  const delegate = useGlobalState(({ delegate }) => delegate)

  const cleanValues = () => {
    setTotalcost(BigInt('0'))
    setInfotxns(undefined)

    setEveryTxns([])
    setAlltxns('')
    setConfirmtnxs(false)
    setblockhash('')
  }

  const onChangeValues = (e: { target: { value: SetStateAction<string> } }) => {
    const contentTemp = String(e.target.value)

    contentValidation({ contentfull: contentTemp })
  }

  const contentValidation = ({ contentfull }: { contentfull: string }) => {
    setConfirmtnxs(false)
    setblockhash('')

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
      logger.error('Invalid format')
      setConfirmtnxs(false)
    }
  }

  const { data: allowance } = useScaffoldContractRead({
    contractName: 'USDC',
    functionName: 'allowance',
    abi: erc20ABI,
    address: tokenSelected.tokenAddress,
    args: [dataClient?.account.address, deployedInfo?.address],
  })

  const { data: decimalsToken } = useScaffoldContractRead({
    contractName: 'USDC',
    functionName: 'decimals',
    abi: erc20ABI,
    address: tokenSelected.tokenAddress,
  })

  const {
    writeAsync: approval,
    isSuccess: isAmountApprovedSuccess,
    isLoading: isLoadingApproval,
  } = useScaffoldContractWrite({
    contractName: 'USDC',
    functionName: 'approve',
    abi: erc20ABI,
    address: tokenSelected.tokenAddress,
    args: [deployedInfo?.address, totalcost * 2n],
  })

  const {
    writeAsync: sendToken,

    isLoading: isLoadingTokenDisperse,
  } = useScaffoldContractWrite({
    contractName: 'ModeSpray',
    functionName: 'disperseToken',
    args: [tokenSelected.tokenAddress, everyTxns.map(item => item.key), everyTxns.map(item => item.value)],
  })

  const approveTransaction = async () => {
    setIsLoading(true)
    if (approval) {
      try {
        if (allowance === undefined || allowance <= totalcost || !isAmountApprovedSuccess) {
          const approvalResult = await approval()
          logger.log('approvalResult', approvalResult)
          setReadyToSpray(true)
        }
      } catch (e: any) {
        const message = getParsedError(e)
        notification.error(message)
      } finally {
        setIsLoading(false)
        setReadyToSpray(false)
      }
    }
  }

  const sprayToken = async () => {
    setIsLoading(true)
    if (sendToken) {
      try {
        const data = await sendToken()
        if (!data) return
        cleanValues()
        setInfotxns(data)
        getBlockexplorerTxnLink(data)

        sendNotifications(data)
      } catch (e: any) {
        const message = getParsedError(e)
        notification.error(message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const sendNotifications = async (hashTxn: AddressProp) => {
    if (!dataClient) return
    const network = await dataClient.getChainId()
    console.log('network', network)

    const linkTx = getTokenAmountByTxn(network, hashTxn)

    const signer = getSigner(delegate)

    const sprayChannel = await PushAPI.initialize(signer, { env: ENV.STAGING })
    logger.log('sprayChannel', sprayChannel)

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
      console.log('Recipients not found')
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
    const linkTx = getBlockExplorerTxLink(network, address)
    setblockhash(linkTx)
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

      <TnxLink infotxns={infotxns} blockhash={blockhash} />
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

            {readyToSpray || allowance ? (
              <Button
                onclick={sprayToken}
                label="Spray Token"
                className={clsx('self-center my-5 w-36')}
                disabled={isLoadingTokenDisperse || isLoading}
              />
            ) : (
              <Button
                onclick={approveTransaction}
                label="Approve Token"
                className={clsx('self-center my-5 w-36')}
                disabled={isLoadingApproval || isLoading}
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
