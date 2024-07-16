import {
  baseNetwork,
  baseSepoliaNetwork,
  hardhatNetwork,
  modeNetwork,
  modeSepoliaNetwork,
  optimismNetwork,
  optimismSepoliaNetwork,
} from './spray-on'
import { GenericContractsDeclaration } from '~~/utils/scaffold-eth/contract'

const deployedContracts = {
  // hardhat
  31337: hardhatNetwork,
  // Mode Sepolia testnet
  919: modeSepoliaNetwork,
  // Mode Mainnet
  34443: modeNetwork,
  // Base Testnet
  84532: baseSepoliaNetwork,
  // Base
  8453: baseNetwork,
  // Optimism Testnet
  11155420: optimismSepoliaNetwork,
  // Optimism
  10: optimismNetwork,
} as const

export default deployedContracts satisfies GenericContractsDeclaration
