import { StepsProps } from './steps.type'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import { LoadingAnimatedIcon } from '~~/icons'

export function Steps({ condition, successMessage, loadingMessage, show }: StepsProps) {
  if (!show) return null

  if (!condition) {
    return (
      <div className="flex items-center gap-3 py-2">
        <LoadingAnimatedIcon className="h-6" />
        {loadingMessage}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <ShieldCheckIcon className="h-6 pl-5 text-neutral-content" />
      {successMessage}
    </div>
  )
}
