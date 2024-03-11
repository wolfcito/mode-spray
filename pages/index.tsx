import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { MetaHeader } from '~~/components/header'
import { SprayMenuSelector } from '~~/components/spray-menu-selector'
import { WrongNetwork } from '~~/components/wrong-network'
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork'
import { logger } from '~~/lib'
import { TokenSelectedProps } from '~~/types/mode-spray'
import { SprayETH, SprayToken } from '~~/view'

export default function Home() {
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const [tokenSelected, setTokenSelected] = useState({} as TokenSelectedProps)

  const { targetNetwork } = useTargetNetwork()
  const { chain } = useNetwork()

  useEffect(() => {
    // logger.log('targetNetwork', targetNetwork)
  }, [targetNetwork.id, chain?.id])

  //  only necessary
  if (chain?.id !== targetNetwork.id) {
    logger.info('You are on the wrong network', chain, targetNetwork)
    return <WrongNetwork />
  }

  const toggleEth = (isEth: boolean) => {
    setIsCustom(isEth)
  }

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center w-full xl:w-[626px] self-center bg-black border border-[#ADB5BD] mx-4 mt-20 md:mt-10 px-4 md:px-8  py-10">
        <div className="w-full p-2 rounded-t-3xl bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col pb-2 space-y-3 rounded-3xl">
            <SprayMenuSelector
              filterNumber={chain?.id}
              isCustom={isCustom}
              networkName={targetNetwork.name}
              toggleEth={toggleEth}
              setTokenSelected={setTokenSelected}
              tokenSelected={tokenSelected}
            />
            {isCustom ? <SprayToken tokenSelected={tokenSelected} /> : <SprayETH />}
          </div>
        </div>
      </div>
    </>
  )
}
