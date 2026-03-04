import { colors } from '@hr-dashboard/design-tokens';
import type { KpiSignal } from '@hr-dashboard/shared-types';

export type SignalColor = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const signalColorMap: Record<SignalColor, string> = {
  success: colors.signal.success,
  warning: colors.signal.warning,
  danger: colors.signal.danger,
  info: colors.signal.info,
  neutral: colors.neutral[400],
};

const signalBgMap: Record<SignalColor, string> = {
  success: '#DCFCE7',
  warning: '#FEF3C7',
  danger: '#FEE2E2',
  info: '#DBEAFE',
  neutral: '#F1F5F9',
};

export function getSignalColor(signal: KpiSignal): string {
  switch (signal) {
    case 'positive':
      return signalColorMap.success;
    case 'negative':
      return signalColorMap.danger;
    case 'warning':
      return signalColorMap.warning;
    case 'neutral':
    default:
      return signalColorMap.neutral;
  }
}

export function getSignalBg(signal: KpiSignal): string {
  switch (signal) {
    case 'positive':
      return signalBgMap.success;
    case 'negative':
      return signalBgMap.danger;
    case 'warning':
      return signalBgMap.warning;
    case 'neutral':
    default:
      return signalBgMap.neutral;
  }
}

export function getSignalTailwind(signal: KpiSignal): string {
  switch (signal) {
    case 'positive':
      return 'text-signal-success bg-green-50';
    case 'negative':
      return 'text-signal-danger bg-red-50';
    case 'warning':
      return 'text-signal-warning bg-amber-50';
    case 'neutral':
    default:
      return 'text-neutral-500 bg-neutral-50';
  }
}

export function getThresholdSignal(
  value: number,
  thresholds: { warningMin?: number; warningMax?: number; dangerMin?: number; dangerMax?: number },
): KpiSignal {
  const { warningMin, warningMax, dangerMin, dangerMax } = thresholds;

  if (dangerMin !== undefined && value < dangerMin) return 'negative';
  if (dangerMax !== undefined && value > dangerMax) return 'negative';
  if (warningMin !== undefined && value < warningMin) return 'warning';
  if (warningMax !== undefined && value > warningMax) return 'warning';

  return 'positive';
}

export { signalColorMap, signalBgMap };
