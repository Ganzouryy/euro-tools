export const TOOL_CATEGORIES = [
  'Electrical Testing',
  'Mechanical Tools',
  'Hydraulic Equipment',
  'Pneumatic Tools',
  'Measurement & Calibration',
  'PLC & Automation',
  'Welding Equipment',
  'Power Tools',
  'Safety Equipment',
  'Diagnostic Tools',
] as const

export const TOOL_CONDITIONS = ['excellent', 'good', 'fair'] as const

export const ORDER_STATUSES = [
  'pending_kyc',
  'pending_payment',
  'confirmed',
  'dispatched',
  'delivered',
  'returned',
  'completed',
  'cancelled',
] as const

export const KYC_STATUSES = ['pending', 'verified', 'rejected'] as const

export const DEPOSIT_STATUSES = ['pending', 'held', 'refunded', 'forfeited'] as const

export const URGENCY_LEVELS = ['low', 'medium', 'high', 'critical'] as const

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
] as const

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'ar', name: 'العربية' },
] as const

export const MIN_RENTAL_DAYS = 1
export const MAX_RENTAL_DAYS = 365

export const INSURANCE_DEPOSIT_PERCENTAGE = 0.3 // 30% of rental fee
