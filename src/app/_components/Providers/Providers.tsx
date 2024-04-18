'use client'
import { Provider } from 'react-redux'
import { store } from '@/app/_store/store'
import type React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
