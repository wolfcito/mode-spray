import { AddressProp } from '~~/types/mode-spray'

export interface TxnLinkProps {
  blockhash: string | undefined
  infotxns: AddressProp | undefined
}
