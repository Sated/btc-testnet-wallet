import ECPairFactory from 'ecpair'
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs'
import * as bitcoin from 'bitcoinjs-lib'
import { getAddressUtxo, getTxIdHex, submitTransaction } from '@/app/_api/api'

const ECPair = ECPairFactory(ecc)
const TESTNET = bitcoin.networks.testnet

const validator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  ECPair.fromPublicKey(pubkey).verify(msghash, signature)

export function validateAddress(address: string) {
  try {
    return Boolean(bitcoin.address.fromBase58Check(address))
  } catch (e) {
    try {
      return Boolean(bitcoin.address.fromBech32(address))
    } catch (e) {
      return false
    }
  }
}

export function createWallet() {
  const keyPair = ECPair.makeRandom({ network: TESTNET })
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: TESTNET,
  })
  return { address: address || '', wif: keyPair.toWIF() }
}

interface CreateTransactionOptions {
  wif: string
  fromAddress: string
  toAddress: string
  amountSats: number
  feeSats: number
  balance: number
}

export async function createTransaction(options: CreateTransactionOptions): Promise<string | null> {
  const { wif, fromAddress, toAddress, amountSats, feeSats, balance } = options
  const walletECPair = ECPair.fromWIF(wif, TESTNET)

  const psbt = new bitcoin.Psbt({ network: TESTNET })

  const utxos = await getAddressUtxo(fromAddress)
  if (!utxos?.length) {
    throw new Error('Invalid UTOXs')
  }

  for (const utxo of utxos) {
    if (!utxo.status.confirmed) {
      throw new Error('Previous transaction not confirmed by Bitcoin blockchain')
    }

    const txHex = await getTxIdHex(utxo.txid)
    if (!txHex) {
      throw new Error('Invalid txHex')
    }

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      nonWitnessUtxo: Buffer.from(txHex, 'hex'),
    })
  }

  psbt.addOutput({
    address: toAddress,
    value: amountSats,
  })

  const value = Math.floor(balance - amountSats - feeSats)
  psbt.addOutput({
    address: fromAddress,
    value: value,
  })
  psbt.signInput(0, walletECPair)
  psbt.validateSignaturesOfInput(0, validator)
  psbt.finalizeAllInputs()

  return await submitTransaction(psbt.extractTransaction().toHex())
}
