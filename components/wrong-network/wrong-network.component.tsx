import { useNetwork, useSwitchNetwork } from 'wagmi'
import { MetaHeader } from '~~/components/header'
import { getTargetNetworks } from '~~/utils/scaffold-eth'

export function WrongNetwork() {
  const allowedNetworks = getTargetNetworks()
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center w-full xl:w-[626px] self-center bg-black border border-[#ADB5BD] mx-4 mt-20 md:mt-10 px-4 md:px-8  py-10">
        <div className="w-full p-2 rounded-t-3xl bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col pb-2 space-y-3 rounded-3xl">
            <p className="text-3xl font-semibold font-chakra">Wrong Network</p>
            <p className="text-lg font-chakra">Please switch to one of our supported networks:</p>
            {allowedNetworks
              .filter(allowedNetwork => allowedNetwork.id !== chain?.id)
              .map(allowedNetwork => (
                <li key={allowedNetwork.id}>
                  <button
                    onClick={() => {
                      switchNetwork?.(allowedNetwork.id)
                    }}
                  >
                    <span className="text-lg font-chakra text-neutral-content">{allowedNetwork.name}</span>
                  </button>
                </li>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
