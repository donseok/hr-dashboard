'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { lifecycleInsights, lifecycleKpis } from '@/mocks/lifecycle';

const signalStyles = {
  success: { dot: 'bg-signal-success', badge: 'success' as const },
  warning: { dot: 'bg-signal-warning', badge: 'warning' as const },
  danger: { dot: 'bg-signal-danger', badge: 'danger' as const },
  info: { dot: 'bg-primary', badge: 'default' as const },
};

export default function LifecycleInsightsSlot() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">AI 통합 인사이트</CardTitle>
            <Badge variant="outline" className="text-[10px]">
              AI 분석
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lifecycleInsights.map((insight, i) => {
              const style = signalStyles[insight.type];
              return (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50 space-y-2"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${style.dot} mt-1.5 flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {insight.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pl-4">
                    <svg
                      className="h-3 w-3 text-neutral-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <span className="text-[11px] text-primary font-medium">
                      {insight.action}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">모듈별 핵심 지표</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(lifecycleKpis).map(([key, kpi]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded-md bg-neutral-50 dark:bg-neutral-800"
              >
                <span className="text-[11px] text-neutral-600 dark:text-neutral-400">{kpi.title}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-mono text-neutral-800 dark:text-neutral-200">
                    {kpi.value}
                    {kpi.unit}
                  </span>
                  <span
                    className={`text-[10px] ${
                      kpi.signal === 'positive'
                        ? 'text-signal-success'
                        : kpi.signal === 'warning'
                          ? 'text-signal-warning'
                          : 'text-neutral-400'
                    }`}
                  >
                    {kpi.trend === 'up' ? '+' : ''}
                    {kpi.changePercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
