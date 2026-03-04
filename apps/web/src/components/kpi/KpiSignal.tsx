'use client';

import { cn } from '@/lib/cn';
import type { KpiSignal as KpiSignalType } from '@/types/kpi';

interface KpiSignalProps {
  signal: KpiSignalType;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
};

const colorMap: Record<KpiSignalType, string> = {
  positive: 'bg-signal-success',
  negative: 'bg-signal-danger',
  warning: 'bg-signal-warning',
  neutral: 'bg-neutral-400',
};

const pulseColorMap: Record<KpiSignalType, string> = {
  positive: 'bg-signal-success/40',
  negative: 'bg-signal-danger/40',
  warning: 'bg-signal-warning/40',
  neutral: 'bg-neutral-400/40',
};

export function KpiSignal({ signal, size = 'md', showPulse = false, className }: KpiSignalProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      {showPulse && signal !== 'neutral' && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            pulseColorMap[signal],
          )}
        />
      )}
      <span className={cn('inline-flex rounded-full', sizeMap[size], colorMap[signal])} />
    </span>
  );
}
