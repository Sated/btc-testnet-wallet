import dynamic from 'next/dynamic'

const DepositNoSSR = dynamic(() => import('@/app/_components/Deposit/Deposit'), {
  ssr: false,
  loading: () => <p className="loader"></p>,
})

export default function DepositPage() {
  return <DepositNoSSR />
}
