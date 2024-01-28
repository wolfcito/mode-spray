import { TxnLinkProps } from './txn-link.type'
import Confetti from 'react-confetti'

export function TnxLink({ blockhash, infotxns }: TxnLinkProps) {
  if (!blockhash || !infotxns) return

  return (
    <div className="flex flex-col w-full bg-[url('/mode/mode-hand.png')] bg-right-bottom bg-contain bg-no-repeat min-h-32">
      <div className="flex flex-col h-auto px-2 pb-10 text-xs bg-black/20 backdrop-blur-sm min-h-32">
        <div className="text-sm text-center">
          <div>Check out details👇👇👇</div>
          <div className="break-words text-neutral-content">
            <a
              className={`ml-1.5 text-xs font-normal font-mono underline underline-offset-2`}
              target="_blank"
              href={blockhash}
              rel="noopener noreferrer"
            >
              {infotxns}
            </a>
          </div>
          <Confetti className="w-full" recycle={false} numberOfPieces={1800} />
        </div>
      </div>
    </div>
  )
}
