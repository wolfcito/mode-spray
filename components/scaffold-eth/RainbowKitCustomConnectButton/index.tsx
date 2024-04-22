import { useCallback, useState } from 'react'
import Image from 'next/image'
import { AddressInfoDropdown } from './AddressInfoDropdown'
import { AddressQRCodeModal } from './AddressQRCodeModal'
import { WrongNetworkDropdown } from './WrongNetworkDropdown'
import { PushAPI } from '@pushprotocol/restapi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import { ConnectButton, useChainModal } from '@rainbow-me/rainbowkit'
import { Address } from 'viem'
import { useWalletClient } from 'wagmi'
import { ButtonWrapper } from '~~/components/button-wrapper'
import { Notifications } from '~~/components/notifications'
import { Balance } from '~~/components/scaffold-eth/Balance'
import { useAutoConnect, useNetworkColor } from '~~/hooks/scaffold-eth'
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork'
import { BellIcon } from '~~/icons'
import { logger } from '~~/lib'
import { getSigner } from '~~/lib/notifications'
import { useGlobalState } from '~~/services/store/store'
import { getBlockExplorerAddressLink } from '~~/utils/scaffold-eth'

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  useAutoConnect()
  const networkColor = useNetworkColor()
  const { targetNetwork } = useTargetNetwork()
  const [notificationList, setNotificationList] = useState<any>([])
  const delegate = useGlobalState(({ delegate }) => delegate)
  const datosClient = useWalletClient()

  const { openChainModal } = useChainModal()

  const notificationsByType = useCallback(async () => {
    const signer = getSigner(delegate)

    // TODO: enable prod env: enviroment.debug ? ENV.STAGING : ENV.PROD
    const sprayChannel = await PushAPI.initialize(signer, { env: ENV.STAGING })

    if (sprayChannel.errors.length > 0) {
      logger.error(sprayChannel.errors)
      return []
    }

    const inbox = await sprayChannel.notification.list('INBOX', {
      account: `eip155:11155111:${datosClient.data?.account.address}`,
    })

    const spam = await sprayChannel.notification.list('SPAM', {
      account: `eip155:11155111:${datosClient.data?.account.address}`,
    })

    const notifications = [...inbox, ...spam]
    notifications.sort((a, b) => b.sid - a.sid)

    setNotificationList(notifications)
  }, [delegate, datosClient])

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />
              }

              return (
                <>
                  <ButtonWrapper classname="!py-0 !px-0 !flex">
                    <input
                      id="notification-panel"
                      type="checkbox"
                      className="drawer-toggle"
                      onClick={notificationsByType}
                    />
                    <label htmlFor="notification-panel">
                      <BellIcon className="h-12 p-0 px-4 cursor-pointer" />
                    </label>
                    <Notifications notificationList={notificationList} />
                  </ButtonWrapper>
                  <ButtonWrapper onclick={openChainModal}>
                    <Image
                      src={targetNetwork.iconUrl ?? ''}
                      className="h-7 w-7"
                      alt="icon chain"
                      width={28}
                      height={28}
                    />
                  </ButtonWrapper>
                  <ButtonWrapper classname="!p-2">
                    <div className="flex flex-col items-center mr-1">
                      <Balance address={account.address as Address} className="h-auto min-h-0" />
                      <span className="text-xs" style={{ color: networkColor }}>
                        {chain.name}
                      </span>
                    </div>
                  </ButtonWrapper>
                  <AddressInfoDropdown
                    address={account.address as Address}
                    displayName={account.displayName}
                    ensAvatar={account.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                  <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
                </>
              )
            })()}
          </>
        )
      }}
    </ConnectButton.Custom>
  )
}
