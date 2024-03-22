import { OfficialTokensProps } from './official-tokens.type'
import aaveIcon from '~~/mode/coins/aave-coin.png'
import balIcon from '~~/mode/coins/bal-coin.png'
import daiIcon from '~~/mode/coins/dai-coin.png'
import ezethIcon from '~~/mode/coins/ezeth-coin.png'
import linkIcon from '~~/mode/coins/link-coin.png'
import snxIcon from '~~/mode/coins/snx-coin.png'
import uniIcon from '~~/mode/coins/uni-coin.png'
import usdcIcon from '~~/mode/coins/usdc-coin.png'
import usdtIcon from '~~/mode/coins/usdt-coin.png'
import wbtcIcon from '~~/mode/coins/wbtc-coin.png'
import wethIcon from '~~/mode/coins/weth-coin.png'
import defaultIcon from '~~/mode/coins/wolf-coin.png'

export const officialTokenByChain: OfficialTokensProps[] = [
  {
    chainId: 919,
    symbol: 'USDC.m',
    address: '0xd7dE2D2525A81A007FdFc8004DD8dbE7d60AF0c6',
    icon: defaultIcon,
  },
  {
    chainId: 919,
    symbol: 'SOL',
    address: '0x5875f5C23935d448A443691Cf216E0252B45Fc7c',
    icon: defaultIcon,
  },
  {
    chainId: 34443,
    symbol: 'USDC',
    address: '0xd988097fb8612cc24eeC14542bC03424c656005f',
    icon: usdcIcon,
  },
  {
    chainId: 34443,
    symbol: 'USDT',
    address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
    icon: usdtIcon,
  },
  {
    chainId: 34443,
    symbol: 'ezETH',
    address: '0x2416092f143378750bb29b79ed961ab195cceea5',
    icon: ezethIcon,
  },
  {
    chainId: 34443,
    symbol: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    icon: wethIcon,
  },
  {
    chainId: 34443,
    symbol: 'WBTC',
    address: '0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF',
    icon: wbtcIcon,
  },
  {
    chainId: 34443,
    symbol: 'UNI',
    address: '0x3e7eF8f50246f725885102E8238CBba33F276747',
    icon: uniIcon,
  },
  {
    chainId: 34443,
    symbol: 'SNX',
    address: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
    icon: snxIcon,
  },
  {
    chainId: 34443,
    symbol: 'LINK',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    icon: linkIcon,
  },
  {
    chainId: 34443,
    symbol: 'DAI',
    address: '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    icon: daiIcon,
  },
  {
    chainId: 34443,
    symbol: 'BAL',
    address: '0xD08a2917653d4E460893203471f0000826fb4034',
    icon: balIcon,
  },
  {
    chainId: 34443,
    symbol: 'AAVE',
    address: '0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2',
    icon: aaveIcon,
  },
]
