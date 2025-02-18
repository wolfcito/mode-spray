import React, { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeaderMenuLinks } from './header-menu-links.component'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { FaucetButton, RainbowKitCustomConnectButton } from '~~/components/scaffold-eth'
import { useOutsideClick } from '~~/hooks/scaffold-eth'
import sprayIcon from '~~/public/favicon.png'

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const burgerMenuRef = useRef<HTMLDivElement>(null)
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  )

  return (
    <div className="sticky top-0 z-20 justify-between flex-shrink-0 min-h-0 px-0 bg-black lg:static navbar sm:px-2 drawer-end">
      <div className="w-auto navbar-start lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost rounded-sm ${isDrawerOpen ? 'hover:bg-secondary' : 'hover:bg-transparent'}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState)
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="p-2 mt-3 rounded-sm shadow menu menu-compact dropdown-content bg-base-100 w-52"
              onClick={() => {
                setIsDrawerOpen(false)
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="items-center hidden gap-2 ml-4 mr-6 lg:flex shrink-0">
          <div className="flex items-center group">
            <Image src={sprayIcon} alt="icon of Mode Spray" width={28} height={28} fetchPriority="high" />
            <span className="ml-2 text-3xl font-bold leading-tight font-chakra">SPRAY</span>
            <div className="flex items-center transition duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div aria-label="divider" className="w-6 h-px mx-2 bg-neutral-700"></div>
              <span className="font-mono text-sm text-neutral">Spray ether or tokens to multiple addresses V1.0.1</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex-grow mr-4 navbar-end">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  )
}
