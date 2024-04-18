import clsx from 'clsx'
import { useEffect } from 'react'
import { ArrowUpCircleIcon, ArrowDownCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { stripAddress } from '@/app/_utils/format'
import type { RootState } from '@/app/_store/store'
import { useGetTransactionsQuery } from '@/app/_services/TransactionsService'

export default function TransactionHistory() {
  const address = useSelector((state: RootState) => state.wallet.address)
  const {
    data: transactions,
    error,
    isLoading,
  } = useGetTransactionsQuery(address, {
    skip: !address,
    pollingInterval: 10000,
  })

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching transaction history`)
    }
  }, [error])

  return (
    <div className="inner gap-y-2.5">
      <h3 className="uppercase text-sm text-neutral-200">Transaction history</h3>

      {isLoading ? (
        <div className="loader"></div>
      ) : transactions?.length ? (
        transactions.map((item) => (
          <a
            href={`https://blockstream.info/testnet/tx/${item.txid}`}
            target="_blank"
            className="flex sm:flex-nowrap flex-wrap gap-3 py-3 hover:opacity-90 transition-opacity"
            key={item.txid}
          >
            <div className="hidden sm:flex round size-10 min-w-10 bg-white text-black">
              <p>
                {item.isReceive ? <ArrowUpCircleIcon className="size-5" /> : <ArrowDownCircleIcon className="size-5" />}
              </p>
            </div>

            <div className="flex flex-col flex-grow">
              <p className="flex items-center gap-x-1 font-medium">
                {item.isReceive ? 'Received' : 'Sent'}
                {item.isConfirmed ? <CheckBadgeIcon className="size-4 text-green" /> : ''}
              </p>
              <p className="text-xs text-nowrap">
                {item.isReceive ? `From ${stripAddress(item.toAddress)}` : `To ${stripAddress(item.fromAddress)}`}
              </p>
            </div>

            <p className={clsx('w-full', 'xs:w-auto', 'sm:text-right', item.isReceive ? 'text-green' : '')}>
              {item.isReceive ? '+' : '-'}
              {item.amount} BTC
            </p>
          </a>
        ))
      ) : (
        <p className="py-4 px-1 text-center text-neutral-200">No transactions found, please send some BTC</p>
      )}
    </div>
  )
}
