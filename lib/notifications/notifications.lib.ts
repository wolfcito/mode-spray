import { Wallet } from 'ethers'
import { logger } from '~~/lib/logger'

export const getSigner = (delegate: string) => {
  if (!delegate) {
    logger.error('delegate env var is invalid or missing. You can either add a valid one')
    return undefined
  }
  return new Wallet(`0x${delegate}`)
}
