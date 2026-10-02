import type { CurrencyCode } from '@/types'
import { CURRENCIES } from '@/config/constants'

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  const currencyObj = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
  const symbol = currencyObj.symbol

  if (isNaN(amount)) return `${symbol}0`

  if (currencyCode === 'INR') {
    // Format according to Indian Numbering System (Lakhs and Crores)
    const isNegative = amount < 0
    const abs = Math.abs(Math.round(amount))
    const s = abs.toString()

    let lastThree = s.substring(s.length - 3)
    const otherNumbers = s.substring(0, s.length - 3)
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree
    }
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
    return `${isNegative ? '-' : ''}${symbol}${res}`
  } else {
    // Standard international numbering system
    return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  }
}

export function formatCompactCurrency(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  const currencyObj = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
  const symbol = currencyObj.symbol

  if (isNaN(amount) || amount === 0) return `${symbol}0`

  if (currencyCode === 'INR') {
    if (Math.abs(amount) >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(2)} Cr`
    }
    if (Math.abs(amount) >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(1)} L`
    }
    if (Math.abs(amount) >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(0)}k`
    }
    return `${symbol}${amount}`
  } else {
    if (Math.abs(amount) >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`
    }
    if (Math.abs(amount) >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(0)}k`
    }
    return `${symbol}${amount}`
  }
}
