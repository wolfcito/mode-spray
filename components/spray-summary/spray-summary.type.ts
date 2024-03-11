import { SprayTransactionProps } from '~~/types/mode-spray'

export interface SpraySummaryProps {
  transactions: SprayTransactionProps[]
  isCustom: boolean
  tokenDecimals: number
  tokenSymbol: string
  totalCost: bigint
}
