// Payment Configuration (Paymob Only)

export const PAYMENT_CONFIG = {
  currency: 'USD',
  provider: 'paymob',

  // Paymob credentials (set in .env.local)
  paymob: {
    apiKey: process.env.PAYMOB_API_KEY || '',
    integrationId: process.env.PAYMOB_INTEGRATION_ID || '',
    iframeId: process.env.PAYMOB_IFRAME_ID || '',
  },
}

// Payment status enum
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Paymob payment types
export enum PaymentMethod {
  CREDIT_CARD = 'card',
  VODAFONE_CASH = 'vodafone_cash',
  ETISALAT_CASH = 'etisalat',
  BANK_TRANSFER = 'bank_transfer',
}

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Helper to calculate total with deposit
export const calculateTotalWithDeposit = (
  rentalFee: number,
  deposit: number
): { rentalFee: number; deposit: number; total: number } => {
  return {
    rentalFee,
    deposit,
    total: rentalFee + deposit,
  }
}

// Payment integration status
export const isPaymentConfigured = (): boolean => {
  return !!(
    process.env.PAYMOB_API_KEY &&
    process.env.PAYMOB_INTEGRATION_ID &&
    process.env.PAYMOB_IFRAME_ID
  )
}

// For development/testing without real payment
export const DEMO_MODE = !isPaymentConfigured()

export const PAYMENT_MESSAGES = {
  demo: 'Payment system is in demo mode. Configure Paymob API keys in .env.local to enable real payments.',
  success: 'Payment processed successfully',
  failed: 'Payment failed. Please try again.',
  pending: 'Payment is being processed...',
}
