import dynamic from 'next/dynamic'

const CreateTransactionNoSSR = dynamic(() => import('@/app/_components/CreateTransaction/CreateTransaction'), {
  ssr: false,
  loading: () => <p className="loader"></p>,
})

export default function SendPage() {
  return <CreateTransactionNoSSR />
}
