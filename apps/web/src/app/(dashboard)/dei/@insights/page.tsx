'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { deiInsights } from '@/mocks/dei';

const signalStyles = {
  success: { dot: 'bg-signal-success', badge: 'success' as const },
  warning: { dot: 'bg-signal-warning', badge: 'warning' as const },
  danger: { dot: 'bg-signal-danger', badge: 'danger' as const },
  info: { dot: 'bg-primary', badge: 'default' as const },
};

export default function DeiInsightsSlot() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">AI DEI 인사이트</CardTitle>
            <Badge variant="outline" className="text-[10px]">
              AI 분석
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deiInsights.map((insight, i) => {
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
          <CardTitle className="text-sm">DEI 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-pink-600">38.5%</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">여성 비율</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-signal-success">3.8%</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">장애인 고용률</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-primary">0.94</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">급여 형평성</p>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-signal-warning">4.1</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">포용성 점수</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
