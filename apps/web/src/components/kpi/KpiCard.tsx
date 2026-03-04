'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import { Card, CardContent } from '@/components/ui/Card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { KpiSignal } from './KpiSignal';
import type { KpiCardDisplayProps } from '@/types/kpi';

const trendIcons = {
  up: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5 5 5-5" />
    </svg>
  ),
  down: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-5 5-5-5m0 10l5-5 5 5" />
    </svg>
  ),
  stable: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  ),
};

const trendColorMap = {
  positive: 'text-signal-success',
  negative: 'text-signal-danger',
  warning: 'text-signal-warning',
  neutral: 'text-neutral-500',
};

function MiniSparkline({ data, signal }: { data: number[]; signal: string }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 64;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(' ');

  const strokeColor =
    signal === 'positive' ? '#22C55E' : signal === 'negative' ? '#EF4444' : signal === 'warning' ? '#F59E0B' : '#94A3B8';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCard({
  title,
  value,
  changePercent,
  trend,
  signal,
  sparklineData,
  unit,
  className,
  tooltip,
}: KpiCardDisplayProps & { tooltip?: string }) {
  const changeText = useMemo(() => {
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(1)}%`;
  }, [changePercent]);

  return (
    <Card className={cn('relative overflow-hidden transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <KpiSignal signal={signal} size="sm" showPulse={signal === 'negative'} />
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate">{title}</span>
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 inline-flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-label="도움말">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                {value}
              </span>
              {unit && (
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{unit}</span>
              )}
            </div>
            <div className={cn('flex items-center gap-1 mt-1', trendColorMap[signal])}>
              {trendIcons[trend]}
              <span className="text-xs font-medium font-mono tabular-nums">
                {changeText}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">vs 전기</span>
            </div>
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <div className="flex-shrink-0 ml-3 self-end">
              <MiniSparkline data={sparklineData} signal={signal} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
