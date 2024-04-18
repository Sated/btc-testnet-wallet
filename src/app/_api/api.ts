import { Transaction, AddressInfo, Utxo } from './types'

const BASE_URL = 'https://blockstream.info/testnet/api'

export async function getAddressTransactions(address: string): Promise<Transaction[]> {
  try {
    return await fetch(`${BASE_URL}/address/${address}/txs`).then((response) => response.json())
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getAddressInfo(address: string): Promise<AddressInfo | null> {
  try {
    return await fetch(`${BASE_URL}/address/${address}`).then((response) => response.json())
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getAddressUtxo(address: string): Promise<Utxo[] | null> {
  try {
    return await fetch(`${BASE_URL}/address/${address}/utxo`).then((response) => response.json())
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function submitTransaction(transactionHex: string): Promise<string | null> {
  try {
    return await fetch(`${BASE_URL}/tx`, { method: 'POST', body: transactionHex }).then((response) => response.text())
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getTxIdHex(txId: string): Promise<string | null> {
  try {
    return await fetch(`${BASE_URL}/tx/${txId}/hex`).then((response) => response.text())
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getTxIdInfo(txId: string): Promise<Transaction | null> {
  try {
    return await fetch(`${BASE_URL}/tx/${txId}`).then((response) => response.json())
  } catch (error) {
    console.error(error)
    return null
  }
}
