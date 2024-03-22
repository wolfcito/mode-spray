import Link from 'next/link'
import { NotificationByAddress } from './notifications.type'
import { nanoid } from 'nanoid'
import { useWalletClient } from 'wagmi'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'

export function TabNotification({ notificationList = [] }: { notificationList: NotificationByAddress[] }) {
  const datosClient = useWalletClient()

  if (!notificationList.length) return <div className="flex flex-col w-full gap-4">{`You haven't notifications`}</div>

  return (
    <li>
      {notificationList.map(notifyment => {
        return (
          <Link
            key={nanoid()}
            className="flex my-1.5 rounded-sm bg-neutral hover:rounded-sm hover:text-neutral-content hover:skeleton"
            href={`https://sepolia.explorer.mode.network/address/${datosClient.data?.account.address}?tab=token_transfers`}
            target="_blank"
          >
            <div className="flex flex-col flex-1">
              <div className="items-start justify-start w-full font-mono">{notifyment.title}</div>

              <div className="items-start justify-start w-full text-xs text-neutral-400">
                {notifyment.notification.body}
              </div>
            </div>
            <ArrowUpRightIcon className="w-4 h-6 ml-2 sm:ml-0" />
          </Link>
        )
      })}
    </li>
  )
}
