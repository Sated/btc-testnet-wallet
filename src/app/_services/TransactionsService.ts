import { api } from '@/app/_services/api'
import { Transaction } from '@/app/_api/types'
import { satsToBtc } from '@/app/_utils/format'

interface TransactionHistoryItem {
  txid: string
  isConfirmed: boolean
  isReceive: boolean
  fromAddress: string
  toAddress: string
  amount: number
}

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query<TransactionHistoryItem[], string>({
      query: (address) => ({ url: `address/${address}/txs` }),
      transformResponse: (response: Transaction[], meta, arg) => {
        return response.map((txn) => {
          const isReceive = txn.vout[0].scriptpubkey_address === arg

          return {
            txid: txn.txid,
            isConfirmed: txn.status.confirmed,
            isReceive,
            fromAddress: isReceive ? arg : txn.vout[0].scriptpubkey_address,
            toAddress: !isReceive ? txn.vout[0].scriptpubkey_address : arg,
            amount: satsToBtc(txn.vout[0].value),
          }
        })
      },
    }),
  }),
})

export const { useGetTransactionsQuery } = extendedApi
