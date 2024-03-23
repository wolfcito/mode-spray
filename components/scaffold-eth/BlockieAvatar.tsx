import { AvatarComponent } from '@rainbow-me/rainbowkit'
import { blo } from 'blo'
import { AddressProp } from '~~/types/mode-spray'

// Custom Avatar for RainbowKit
export const BlockieAvatar: AvatarComponent = ({ address, ensImage, size }) => (
  // Don't want to use nextJS Image here (and adding remote patterns for the URL)
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="rounded-sm"
    src={ensImage || blo(address as AddressProp)}
    width={size}
    height={size}
    alt={`${address} avatar`}
  />
)
