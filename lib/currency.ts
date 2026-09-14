// Currency conversion service using exchangerate-api.com
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY
const BASE_CURRENCY = 'USD'

interface ExchangeRates {
  [currency: string]: number
}

let cachedRates: ExchangeRates | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function getExchangeRates(): Promise<ExchangeRates> {
  // Return cached rates if still valid
  if (cachedRates && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedRates
  }

  try {
    const url = EXCHANGE_RATE_API_KEY
      ? `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${BASE_CURRENCY}`
      : `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.conversion_rates || data.rates) {
      cachedRates = data.conversion_rates || data.rates
      cacheTimestamp = Date.now()
      return cachedRates!
    }

    throw new Error('Invalid API response')
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)

    // Fallback to approximate rates if API fails
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      EGP: 48.5,
      AED: 3.67,
      SAR: 3.75,
    }
  }
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount

  const rates = await getExchangeRates()

  // Convert to USD first if source is not USD
  const amountInUSD = fromCurrency === BASE_CURRENCY
    ? amount
    : amount / (rates[fromCurrency] || 1)

  // Convert from USD to target currency
  const convertedAmount = amountInUSD * (rates[toCurrency] || 1)

  return Math.round(convertedAmount * 100) / 100
}

export async function formatPriceWithCurrency(
  amountUSD: number,
  targetCurrency: string
): Promise<string> {
  const convertedAmount = await convertCurrency(amountUSD, 'USD', targetCurrency)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: targetCurrency,
  }).format(convertedAmount)
}
