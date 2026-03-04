import { format as dateFnsFormat, parseISO, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 1,
    ...options,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCurrency(value: number, currency = 'KRW'): string {
  if (currency === 'KRW') {
    if (value >= 100_000_000) {
      return `${(value / 100_000_000).toFixed(1)}억원`;
    }
    if (value >= 10_000) {
      return `${(value / 10_000).toFixed(0)}만원`;
    }
    return `${formatNumber(value)}원`;
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    return months > 0 ? `${years}년 ${months}개월` : `${years}년`;
  }
  if (days >= 30) {
    return `${Math.floor(days / 30)}개월`;
  }
  return `${days}일`;
}

export function formatDate(date: string | Date, pattern = 'yyyy.MM.dd'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsFormat(d, pattern, { locale: ko });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ko });
}

export function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

export function formatKpiValue(
  value: number,
  format: 'number' | 'percent' | 'currency' | 'duration',
): string {
  switch (format) {
    case 'percent':
      return formatPercent(value);
    case 'currency':
      return formatCurrency(value);
    case 'duration':
      return formatDuration(value);
    case 'number':
    default:
      return formatNumber(value);
  }
}
