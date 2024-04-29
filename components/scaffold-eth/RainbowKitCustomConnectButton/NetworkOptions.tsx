import Image from 'next/image'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { getTargetNetworks } from '~~/utils/scaffold-eth'

const allowedNetworks = getTargetNetworks()

type NetworkOptionsProps = {
  hidden?: boolean
}

export const NetworkOptions = ({ hidden = false }: NetworkOptionsProps) => {
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()

  return (
    <>
      <b className="mx-2">Switch to </b>
      {allowedNetworks
        .filter(allowedNetwork => allowedNetwork.id !== chain?.id)
        .map(allowedNetwork => {
          return (
            <li key={allowedNetwork.id} className={hidden ? 'hidden' : ''}>
              <button
                className="menu-item btn-sm !rounded-sm flex gap-3 py-3 whitespace-nowrap"
                type="button"
                onClick={() => {
                  switchNetwork?.(allowedNetwork.id)
                }}
              >
                <ArrowsRightLeftIcon className="w-4 h-6 ml-2 sm:ml-0" />
                <span className="flex items-center gap-2 mr-3">
                  <Image
                    src={allowedNetwork.iconUrl as string}
                    className="w-4 h-4"
                    alt="icon chain"
                    width={28}
                    height={28}
                  />
                  {allowedNetwork.name}
                </span>
              </button>
            </li>
          )
        })}
    </>
  )
}
