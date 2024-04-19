export function satsToBtc(satoshis: number) {
  return satoshis / 100000000
}

export function btcToSats(btc: number) {
  return Math.floor(btc * 100000000)
}

export function stripAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}
