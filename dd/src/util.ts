export function formatPhoneNumber(phone: string | number): string {
  const digits = String(phone).replace(/\D/g, '')
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) - ${digits.slice(3, 6)} - ${digits.slice(6)}`
  }
  return phone.toString()
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function acersToSquareFeet(acres: number): number {
  return acres * 43560
}

export function squareFeetToAcers(sqft: number): number {
  return sqft / 43560
}

export function formatAcres(acres: number): string {
  return `${acres} acres`
}

export function formatNumber(num: number): string {
  return num.toString().replace(/\d(?=(\d{3})+$)/g, '$&,')
}

export function formatPriceStatus(validFrom: string, validTo?: string): string {
  const now = new Date()
  const from = new Date(validFrom)
  const to = validTo ? new Date(validTo) : undefined
  if (now >= from && (!to || now <= to)) {
    return 'Unexpired'
  }
  return 'Expired'
}

export function formatAddress(
  addressline1: string,
  addressline2: string | undefined,
  city: string,
  state: string,
  zip: string,
  country: string
): string {
  return `${addressline1}${addressline2 ? ', ' + addressline2 : ''}, ${city}, ${state} ${zip}, ${country}`
}

export function formatCouponDiscountValue(
  discountType: 'Percentage' | 'Fixed',
  discountValue: number
): string {
  return discountType === 'Percentage' ? `${discountValue}%` : formatCurrency(discountValue)
}

export function getCouponExpiration(validFrom: string, validTo?: string): string {
  const now = new Date();
  const from = new Date(validFrom);
  const to = validTo ? new Date(validTo) : undefined;
  if (now >= from && (!to || now <= to)) {
    return 'Unexpired';
  }
  return 'Expired';
}
