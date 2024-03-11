import { SprayHeaderProps } from './spray-header.type'
import { Tooltip } from '~~/components/tooltip'

export function SprayHeader({ tokenName }: SprayHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="p-0 m-0 text-2xl font-semibold font-chakra">
          Account Panel <Tooltip toolTipText={`Allowed separators  , ; = & (space)`} />
        </h2>
        <p className="font-mono text-xs font-normal m-0 text-[#4c4c4c]">
          one address and amount[{tokenName}] on each line
        </p>
      </div>
    </div>
  )
}
