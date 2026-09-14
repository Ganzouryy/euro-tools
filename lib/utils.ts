import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function generateOrderNumber(): string {
  const prefix = 'RT'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}${random}`
}

export function generateRequestNumber(): string {
  const prefix = 'CR'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}${random}`
}

export function calculateRentalPrice(
  pricePerDay: number,
  pricePerWeek: number | null,
  pricePerMonth: number | null,
  days: number
): number {
  if (days >= 30 && pricePerMonth) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return months * pricePerMonth + remainingDays * pricePerDay
  } else if (days >= 7 && pricePerWeek) {
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    return weeks * pricePerWeek + remainingDays * pricePerDay
  }
  return days * pricePerDay
}

export function getDaysBetween(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
