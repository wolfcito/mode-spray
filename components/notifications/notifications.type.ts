export interface NotificationsProps {
  notificationList: NotificationByAddress[]
}

export interface BlockchainTransactionsProps {
  timestamp: string
  fee: Fee
  gas_limit: string
  block: number
  status: string
  method: string
  confirmations: number
  type: number
  exchange_rate: string
  to: To
  tx_burnt_fee: string
  max_fee_per_gas: string
  result: string
  hash: string
  op_withdrawals: any[]
  gas_price: string
  priority_fee: string
  base_fee_per_gas: string
  from: From
  token_transfers: TokenTransfer[]
  tx_types: string[]
  gas_used: string
  created_contract: any
  position: number
  nonce: number
  has_error_in_internal_txs: boolean
  actions: any[]
  decoded_input: DecodedInput
  token_transfers_overflow: boolean
  raw_input: string
  value: string
  max_priority_fee_per_gas: string
  revert_reason: any
  confirmation_duration: number[]
  tx_tag: any
}

interface Fee {
  type: string
  value: string
}

interface To {
  ens_domain_name: any
  hash: string
  implementation_name: any
  is_contract: boolean
  is_verified: boolean
  name: any
  private_tags: any[]
  public_tags: any[]
  watchlist_names: any[]
}

interface From {
  ens_domain_name: any
  hash: string
  implementation_name: any
  is_contract: boolean
  is_verified: boolean
  name: any
  private_tags: any[]
  public_tags: any[]
  watchlist_names: any[]
}

export interface TokenTransfer {
  block_hash: string
  from: From
  log_index: string
  method: any
  timestamp: any
  to: To
  token: Token
  total: Total
  tx_hash: string
  type: string
}

interface Token {
  address: string
  circulating_market_cap: any
  decimals: string
  exchange_rate: any
  holders: string
  icon_url: any
  name: string
  symbol: string
  total_supply: string
  type: string
}

interface Total {
  decimals: string
  value: string
}

interface DecodedInput {
  method_call: string
  method_id: string
  parameters: Parameter[]
}

export interface Parameter {
  name: string
  type: string
  value: any
}

export interface NotificationByAddress {
  cta: string
  title: string
  message: string
  icon: string
  url: string
  sid: string
  app: string
  image: string
  blockchain: string
  notification: Notification
  secret: string
}

interface Notification {
  body: string
  title: string
}
