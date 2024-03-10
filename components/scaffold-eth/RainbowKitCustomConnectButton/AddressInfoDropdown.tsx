import { useRef, useState } from 'react'
import { NetworkOptions } from './NetworkOptions'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Address, useDisconnect } from 'wagmi'
import {
  ArrowDownLeftIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'
import { BlockieAvatar } from '~~/components/scaffold-eth'
import { useOutsideClick } from '~~/hooks/scaffold-eth'
import { getTargetNetworks } from '~~/utils/scaffold-eth'

const allowedNetworks = getTargetNetworks()

type AddressInfoDropdownProps = {
  address: Address
  blockExplorerAddressLink: string | undefined
  displayName: string
  ensAvatar?: string
}

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect()

  const [addressCopied, setAddressCopied] = useState(false)

  const [selectingNetwork, setSelectingNetwork] = useState(false)
  const dropdownRef = useRef<HTMLDetailsElement>(null)
  const closeDropdown = () => {
    setSelectingNetwork(false)
    dropdownRef.current?.removeAttribute('open')
  }
  useOutsideClick(dropdownRef, closeDropdown)

  return (
    <details ref={dropdownRef} className="leading-3 dropdown dropdown-end">
      <summary tabIndex={0} className="btn btn-sm p-2 dropdown-toggle gap-0 !h-auto rounded-sm">
        <BlockieAvatar address={address} size={30} ensImage={ensAvatar} />
        <span className="ml-2 mr-1">{displayName}</span>
        <ChevronDownIcon className="w-4 h-6 ml-2 sm:ml-0" />
      </summary>
      <ul tabIndex={0} className="dropdown-content menu z-[2] p-2 mt-2 bg-neutral rounded-sm gap-1">
        <NetworkOptions hidden={!selectingNetwork} />
        <li className={selectingNetwork ? 'hidden' : ''}>
          {addressCopied ? (
            <div className="btn-sm !rounded-sm flex gap-3 py-3">
              <CheckCircleIcon className="w-4 h-6 ml-2 text-xl font-normal cursor-pointer sm:ml-0" aria-hidden="true" />
              <span className=" whitespace-nowrap">Copy address</span>
            </div>
          ) : (
            <CopyToClipboard
              text={address}
              onCopy={() => {
                setAddressCopied(true)
                setTimeout(() => {
                  setAddressCopied(false)
                }, 800)
              }}
            >
              <div className="btn-sm !rounded-sm flex gap-3 py-3">
                <DocumentDuplicateIcon
                  className="w-4 h-6 ml-2 text-xl font-normal cursor-pointer sm:ml-0"
                  aria-hidden="true"
                />
                <span className=" whitespace-nowrap">Copy address</span>
              </div>
            </CopyToClipboard>
          )}
        </li>
        <li className={selectingNetwork ? 'hidden' : ''}>
          <label htmlFor="qrcode-modal" className="btn-sm !rounded-sm flex gap-3 py-3">
            <QrCodeIcon className="w-4 h-6 ml-2 sm:ml-0" />
            <span className="whitespace-nowrap">View QR Code</span>
          </label>
        </li>
        <li className={selectingNetwork ? 'hidden' : ''}>
          <button className="menu-item btn-sm !rounded-sm flex gap-3 py-3" type="button">
            <ArrowTopRightOnSquareIcon className="w-4 h-6 ml-2 sm:ml-0" />
            <a target="_blank" href={blockExplorerAddressLink} rel="noopener noreferrer" className="whitespace-nowrap">
              View on Block Explorer
            </a>
          </button>
        </li>
        {allowedNetworks.length > 1 ? (
          <li className={selectingNetwork ? 'hidden' : ''}>
            <button
              className="btn-sm !rounded-sm flex gap-3 py-3"
              type="button"
              onClick={() => {
                setSelectingNetwork(true)
              }}
            >
              <ArrowsRightLeftIcon className="w-4 h-6 ml-2 sm:ml-0" /> <span>Switch Network</span>
            </button>
          </li>
        ) : null}
        <li className={selectingNetwork ? 'hidden' : ''}>
          <button
            className="menu-item text-error btn-sm !rounded-sm flex gap-3 py-3"
            type="button"
            onClick={() => disconnect()}
          >
            <ArrowDownLeftIcon className="w-4 h-6 ml-2 sm:ml-0" /> <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </details>
  )
}
