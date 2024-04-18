'use client'

import Link from 'next/link'
import { toast } from 'react-toastify'
import { useClipboard } from '@reactuses/core'
import { useEffect, useState } from 'react'
import { ArrowLeftCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'

import { useSelector } from 'react-redux'
import type { RootState } from '@/app/_store/store'

import { stripAddress } from '@/app/_utils/format'
import TransactionHistory from '@/app/_components/TransactionHistory/TransationHistory'
import CreateWallet from '@/app/_components/CreateWallet/CreateWallet'
import Balance from '@/app/_components/Balance/Balance'

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const address = useSelector((state: RootState) => state.wallet.address)

  const [, copy] = useClipboard()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="page">
      {!isMounted ? (
        <div className="loader"></div>
      ) : address ? (
        <>
          <div className="text-center">Your Bitcoin address</div>
          <div
            className="title cursor-pointer"
            onClick={() => {
              copy(address).then(() => toast.success('Copied'))
            }}
          >
            {stripAddress(address)} {<DocumentDuplicateIcon className="sm:size-6 size-5" />}
          </div>

          <Balance className="text-center text-2xl"></Balance>

          <div className="flex-row-flow">
            <Link href="/send/" className="btn-primary">
              <PaperAirplaneIcon className="size-6" />
              Send
            </Link>
            <Link href="/deposit/" className="btn-primary">
              <ArrowLeftCircleIcon className="size-6" />
              Deposit
            </Link>
          </div>

          <TransactionHistory />
        </>
      ) : (
        <CreateWallet />
      )}
    </div>
  )
}
