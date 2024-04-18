import { createWallet } from '@/app/_utils/wallet'
import { useDispatch } from 'react-redux'
import { setWallet } from '@/app/_store/wallet/walletSlice'

export default function CreateWallet() {
  const dispatch = useDispatch()

  function storeWallet() {
    const wallet = createWallet()

    dispatch(setWallet({ address: wallet.address, wif: wallet.wif }))
  }

  return (
    <>
      <p className="title">Welcome</p>
      <div className="inner gap-y-2.5">
        <p className="p-4 text-center leading-5">No wallets found, please create one</p>

        <button className="btn-primary" type="button" onClick={() => storeWallet()}>
          Create Wallet
        </button>
      </div>
    </>
  )
}
