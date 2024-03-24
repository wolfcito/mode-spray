export type AddressProp = `0x${string}`

export interface SprayTransactionProps {
  key: string
  value: bigint
}

export interface TokenSelectedProps {
  tokenAddress: AddressProp
  tokenSymbol: string
}

export type sprayStatus = 'loading' | 'success' | 'error' | 'default'
