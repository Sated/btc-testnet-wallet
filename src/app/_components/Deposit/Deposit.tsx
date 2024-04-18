'use client'

import { useClipboard } from '@reactuses/core'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { RootState } from '@/app/_store/store'
import { stripAddress } from '@/app/_utils/format'

export default function Deposit() {
  const router = useRouter()
  const address = useSelector((state: RootState) => state.wallet.address)
  const [, copy] = useClipboard()
  const [copyButtonText, setCopyButtonText] = useState('Copy Address')

  function onCopy(timeout = 3000) {
    setCopyButtonText('Copied')
    if (onCopy.prototype._timer) clearTimeout(onCopy.prototype._timer)
    onCopy.prototype._timer = setTimeout(() => {
      setCopyButtonText('Copy Address')
    }, timeout)
  }

  useEffect(() => {
    if (!address) {
      router.replace('/')
    }
  }, [address, router])

  return (
    <>
      <div className="title">Deposit BTC</div>

      <div className="inner gap-y-2.5">
        <div className="text-center leading-5">Your Bitcoin address</div>

        <div className="title">{!address ? '...' : stripAddress(address)}</div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            copy(address).then(() => onCopy())
          }}
        >
          {copyButtonText}
          <DocumentDuplicateIcon className="sm:size-6 size-5" />
        </button>
      </div>
    </>
  )
}
