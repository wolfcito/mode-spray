import Link from 'next/link'
import { BlockieAvatar } from '../scaffold-eth'
import { HistoryTabProps } from './tabs.type'
import { intlFormatDistance } from 'date-fns'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { addressFormatter } from '~~/lib/address-formatter'

export function TabHistory({ hash, timestamp }: HistoryTabProps) {
  return (
    <li>
      <Link
        className="flex rounded-sm bg-neutral hover:text-neutral-content"
        href={'https://sepolia.explorer.mode.network/tx/<transaction>'}
        target="_blank"
      >
        <BlockieAvatar address={'0x11F3Ccc1531D4de09d39cF039f9B836bD47FcaA2'} size={30} ensImage={null} />
        <div className="flex flex-col flex-1">
          <div className="items-start justify-start w-full font-mono">txn: {addressFormatter(hash)}</div>
          <div className="items-start justify-start w-full text-xs text-neutral-400">
            {intlFormatDistance(timestamp, new Date())}
          </div>
        </div>
        <ArrowUpRightIcon className="w-4 h-6 ml-2 sm:ml-0" />
      </Link>
    </li>
  )
}
