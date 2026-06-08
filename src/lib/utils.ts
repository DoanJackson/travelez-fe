import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatVND(amount: number | null | undefined): string {
  if (amount == null || amount === 0) return "0đ";
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1)}M đ`;
  }
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return `${Math.round(k)}K đ`;
  }
  return `${amount.toLocaleString("vi-VN")}đ`;
}
