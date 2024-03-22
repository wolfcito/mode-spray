import { Wallet } from 'ethers'
import { logger } from '~~/lib/logger'

export const getSigner = (DELEGATE_KEY: string) => {
  console.log('DELEGATE_KEY', DELEGATE_KEY)
  if (!DELEGATE_KEY) {
    logger.error('DELEGATE_KEY env var is invalid or missing. You can either add a valid one')
    return undefined
  }
  return new Wallet(`0x${DELEGATE_KEY}`)
}
