'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { validateAddress, createTransaction } from '@/app/_utils/wallet'
import { btcToSats, satsToBtc, stripAddress } from '@/app/_utils/format'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/_store/store'
import { useGetBalanceQuery } from '@/app/_services/AddressService'
import { IMaskInput } from 'react-imask'
import { useRouter } from 'next/navigation'
import Balance from '@/app/_components/Balance/Balance'

const FEE_SATOSHI = 400
const FEE = satsToBtc(FEE_SATOSHI)

export default function CreateTransaction() {
  const router = useRouter()
  const address = useSelector((state: RootState) => state.wallet.address)
  const wif = useSelector((state: RootState) => state.wallet.wif)
  const { data: balance, error: balanceLoadingError } = useGetBalanceQuery(address, {
    skip: !address,
    pollingInterval: 10000,
  })

  const ref = useRef(null)
  const inputRef = useRef(null)

  const [targetAddress, setTargetAddress] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [amount, setAmount] = useState(0)
  const [amountString, setAmountString] = useState('0')

  function validateBalance(amount: number) {
    return amount + FEE <= balance! && amount > 0
  }

  useEffect(() => {
    if (!address) {
      router.replace('/')
    }
  }, [address, router])

  useEffect(() => {
    if (balanceLoadingError) toast.error(`Error fetching wallet balance`)
  }, [balanceLoadingError])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = toast.loading('Transaction is in progress...')

    if (!validateAddress(targetAddress)) {
      toast.update(id, { render: 'Address is invalid format', type: 'error', isLoading: false, autoClose: 5000 })
      return
    }

    if (address === targetAddress) {
      toast.update(id, {
        render: 'Wallet address must be different from your own',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      })
      return
    }

    if (!validateBalance(amount)) {
      toast.update(id, {
        render: balance
          ? `Amount must be greater than ${FEE} and less than ${balance} BTC (transaction fee is ${FEE_SATOSHI} satoshis)`
          : `Balance is zero (transaction fee is ${FEE_SATOSHI} satoshis)`,
        type: 'error',
        isLoading: false,
        autoClose: 8000,
      })
      return
    }

    let txid: string | null = null
    try {
      txid = await createTransaction({
        wif: wif,
        fromAddress: address,
        toAddress: targetAddress,
        amountSats: btcToSats(amount),
        feeSats: FEE_SATOSHI,
        balance: btcToSats(balance!),
      })
    } catch (e) {
      toast.update(id, {
        render: e?.toString(),
        type: 'error',
        isLoading: false,
        autoClose: 8000,
      })
    }

    if (txid) {
      toast.update(id, {
        render: `Successfully sent ${amount} BTC to ${targetAddress}`,
        type: 'success',
        isLoading: false,
        autoClose: 5000,
      })
      setIsSuccess(true)
    }
  }

  return (
    <>
      <div className="title">{isSuccess ? 'Success!' : 'Send BTC'}</div>

      <div className="inner w-full">
        {isSuccess ? (
          <div className="flex flex-col gap-y-2.5 text-center">
            <span>Bitcoins sent!</span>
            <strong className="sm:text-3xl text-2xl">{amount} BTC</strong>
            <strong className="sm:text-2xl text-xl leading-7">{`${stripAddress(address)}`}</strong>
            <Link href="/" className="btn-primary">
              Back
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-y-2.5">
            <input
              type="text"
              className="input"
              placeholder="Address"
              required
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.currentTarget.value)}
            />
            <IMaskInput
              mask={Number}
              radix="."
              autofix={false}
              scale={8}
              min={0}
              max={balance}
              unmask={true}
              ref={ref}
              inputRef={inputRef}
              onAccept={(value, mask) => {
                setAmount(parseFloat(value))
                setAmountString(mask.unmaskedValue)
              }}
              className="input"
              placeholder="Amount"
              required
            />
            <strong className="sm:text-2xl text-xl leading-7">{`${stripAddress(address)}`}</strong>
            <strong>{amountString} BTC</strong>
            <Balance className="text-xs" prepend="From balance: " />
            <button className="btn-primary" type="submit">
              Send
              <PaperAirplaneIcon className="size-6" />
            </button>
          </form>
        )}
      </div>
    </>
  )
}
