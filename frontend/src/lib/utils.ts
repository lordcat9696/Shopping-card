import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(vnd: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(vnd)
}

/**
 * Validate VN phone: 10 chữ số bắt đầu 0, hoặc +84 rồi 9–10 chữ số.
 * Chấp nhận space/dash, tự strip khi so khớp.
 */
export function isValidVnPhone(raw: string): boolean {
  const s = raw.replace(/[\s-]/g, '')
  return /^(0|\+84)\d{9,10}$/.test(s)
}

export function phoneErrorMessage(raw: string): string | null {
  const s = raw.trim()
  if (!s) return 'Vui lòng nhập số điện thoại'
  if (!isValidVnPhone(s)) return 'SĐT không hợp lệ (vd: 0912345678 hoặc +84912345678)'
  return null
}
