'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface WalletState {
  address: string
  wif: string
  balance: number
}

const initialState: WalletState =
  typeof window !== 'undefined'
    ? {
        address: localStorage.getItem('_wallet-address') || '',
        wif: localStorage.getItem('_wallet-wif') || '',
        balance: parseInt(localStorage.getItem('_wallet-balance') || '0'),
      }
    : {
        address: '',
        wif: '',
        balance: 0,
      }

export const counterSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<{ address: string; wif: string }>) => {
      state.address = action.payload.address
      state.wif = action.payload.wif
      localStorage.setItem('_wallet-address', action.payload.address)
      localStorage.setItem('_wallet-wif', action.payload.wif)
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
      localStorage.setItem('_wallet-balance', action.payload.toString())
    },
  },
})

export const { setWallet } = counterSlice.actions

export default counterSlice.reducer
