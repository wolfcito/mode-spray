import { NetworkOptions } from './NetworkOptions'
import { useDisconnect } from 'wagmi'
import { ArrowDownLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export const WrongNetworkDropdown = () => {
  const { disconnect } = useDisconnect()

  return (
    <div className="mr-2 dropdown dropdown-end">
      <label tabIndex={0} className="gap-1 rounded-sm btn btn-error btn-sm dropdown-toggle">
        <span>Update Network</span>
        <ChevronDownIcon className="w-4 h-6 ml-2 sm:ml-0" />
      </label>
      <ul tabIndex={0} className="gap-1 p-2 mt-1 rounded-sm dropdown-content menu bg-neutral">
        <NetworkOptions />
        <li>
          <button
            className="menu-item text-error btn-sm !rounded-sm flex gap-3 py-3"
            type="button"
            onClick={() => disconnect()}
          >
            <ArrowDownLeftIcon className="w-4 h-6 ml-2 sm:ml-0" />
            <span>Disconnect</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
