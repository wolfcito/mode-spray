import Link from 'next/link'
import { NotificationByAddress } from './notifications.type'
import { nanoid } from 'nanoid'
import { useWalletClient } from 'wagmi'
import { ArrowUpRightIcon, EyeIcon } from '@heroicons/react/24/outline'

export function TabNotification({ notificationList = [] }: { notificationList: NotificationByAddress[] }) {
  const { data: dataClient } = useWalletClient()

  if (!notificationList.length) return <div className="flex flex-col w-full gap-4">{`You haven't notifications`}</div>

  return (
    <li>
      <Link
        key={nanoid()}
        className="flex my-1.5 rounded-sm hover:rounded-sm text-neutral-content hover:skeleton"
        href={`${dataClient?.chain.rpcUrls.default}/address/${dataClient?.account.address}?tab=token_transfers`}
        target="_blank"
      >
        <EyeIcon className="w-4 h-6 ml-2 sm:ml-0" />
        <div className="flex flex-col flex-1">View ON-CHAIN transactions</div>
        <ArrowUpRightIcon className="w-4 h-6 ml-2 sm:ml-0" />
      </Link>
      {notificationList.map(notifyment => {
        return (
          <Link
            key={nanoid()}
            className="flex my-1.5 rounded-sm bg-neutral/50 hover:rounded-sm hover:text-neutral-content hover:skeleton"
            href={notifyment.cta}
            target="_blank"
          >
            <div className="flex flex-col flex-1">
              <div className="items-start justify-start w-full font-mono">{notifyment.title}</div>

              <div className="items-start justify-start w-full text-xs text-neutral-400">
                {notifyment.notification.body}
              </div>
            </div>
          </Link>
        )
      })}
    </li>
  )
}
