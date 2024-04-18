import { useSelector } from 'react-redux'
import type { RootState } from '@/app/_store/store'
import { useGetBalanceQuery } from '@/app/_services/AddressService'
import React, { useEffect, memo } from 'react'
import { toast } from 'react-toastify'

interface BalanceProps extends React.ComponentPropsWithoutRef<'div'> {
  prepend?: string
}

export default memo(function Balance(props: BalanceProps) {
  const address = useSelector((state: RootState) => state.wallet.address)
  const {
    data: balance,
    error: balanceLoadingError,
    isLoading: isBalanceLoading,
  } = useGetBalanceQuery(address, {
    skip: !address,
    pollingInterval: 10000,
  })
  useEffect(() => {
    if (balanceLoadingError) toast.error(`Error fetching wallet balance`)
  }, [balanceLoadingError])

  return (
    <div {...props}>
      {props.prepend || ''}
      {isBalanceLoading ? '...' : `${balance} BTC`}
    </div>
  )
})
