import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import NextNProgress from 'nextjs-progressbar'
import { Toaster } from 'react-hot-toast'
import { useDarkMode } from 'usehooks-ts'
import { WagmiConfig } from 'wagmi'
import { Footer } from '~~/components/footer'
import { Header } from '~~/components/header'
import { BlockieAvatar } from '~~/components/scaffold-eth'
import { useNativeCurrencyPrice } from '~~/hooks/scaffold-eth'
import { useGlobalState } from '~~/services/store/store'
import { wagmiConfig } from '~~/services/web3/wagmiConfig'
import { appChains } from '~~/services/web3/wagmiConnectors'
import '~~/styles/globals.css'

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice()
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice)

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price)
    }
  }, [setNativeCurrencyPrice, price])

  return (
    <>
      <div className="flex flex-col min-h-screen font-ibm-sans bg-[url('/grid-molecule.png')] bg-repeat">
        <Header />
        <main className="relative flex flex-col flex-1">
          <Component {...pageProps} />
        </main>
      </div>
      <Toaster />
      <Footer />
    </>
  )
}

const ScaffoldEthAppWithProviders = (props: AppProps) => {
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const { isDarkMode } = useDarkMode()
  useEffect(() => {
    setIsDarkTheme(isDarkMode)
  }, [isDarkMode])

  return (
    <WagmiConfig config={wagmiConfig}>
      <NextNProgress />
      <RainbowKitProvider
        chains={appChains.chains}
        avatar={BlockieAvatar}
        theme={isDarkTheme ? darkTheme() : lightTheme()}
        modalSize="compact"
        coolMode
        initialChain={appChains.chains[1]}
      >
        <ScaffoldEthApp {...props} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ScaffoldEthAppWithProviders
