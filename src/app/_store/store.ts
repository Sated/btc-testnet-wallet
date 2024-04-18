'use client'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import walletReducer from '@/app/_store/wallet/walletSlice'
import { api } from '@/app/_services/api'

const rootReducer = combineReducers({
  wallet: walletReducer,
  [api.reducerPath]: api.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
