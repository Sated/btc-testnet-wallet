import { AddressInfo } from '@/app/_api/types'
import { satsToBtc } from '@/app/_utils/format'
import { api } from '@/app/_services/api'

const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBalance: build.query<number, string>({
      query: (address) => ({ url: `address/${address}` }),
      transformResponse: (response: AddressInfo, meta, arg) => {
        return satsToBtc(
          response.mempool_stats.funded_txo_sum > 0
            ? response.mempool_stats.funded_txo_sum
            : response.chain_stats.funded_txo_sum - response.chain_stats.spent_txo_sum,
        )
      },
    }),
  }),
})

export const { useGetBalanceQuery } = extendedApi
