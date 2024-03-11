import { TokenSelectedProps } from '~~/types/mode-spray'

export interface SprayMenuSelectorProps {
  filterNumber: number
  isCustom: boolean
  networkName: string
  toggleEth: (value: boolean) => void
  setTokenSelected: (value: TokenSelectedProps) => void
  tokenSelected: TokenSelectedProps
}
