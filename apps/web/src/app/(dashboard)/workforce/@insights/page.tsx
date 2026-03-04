'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { workforceInsights } from '@/mocks/workforce';

const signalStyles = {
  success: { dot: 'bg-signal-success', badge: 'success' as const },
  warning: { dot: 'bg-signal-warning', badge: 'warning' as const },
  danger: { dot: 'bg-signal-danger', badge: 'danger' as const },
  info: { dot: 'bg-primary', badge: 'default' as const },
};

export default function WorkforceInsightsSlot() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">AI 이탈 위험 알림</CardTitle>
            <Badge variant="danger" className="text-[10px]">
              3명 위험
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {[
              { name: '김OO', dept: '개발 2팀', risk: 92, reason: '보상 경쟁력 하락' },
              { name: '이OO', dept: '개발 3팀', risk: 85, reason: '성장기회 부족' },
              { name: '박OO', dept: '개발 1팀', risk: 81, reason: '보상 경쟁력 하락' },
            ].map((person, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-red-100 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/20"
              >
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-red-600">
                    {person.risk}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {person.name}
                  </p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {person.dept} · {person.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-700 pt-4">
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-3">전체 인사이트</p>
            <div className="space-y-3">
              {workforceInsights.map((insight, i) => {
                const style = signalStyles[insight.type];
                return (
                  <div key={i} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className={`h-2 w-2 rounded-full ${style.dot} mt-1.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{insight.title}</p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pl-4">
                      <svg className="h-3 w-3 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span className="text-[11px] text-primary font-medium">{insight.action}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">인력 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-primary">1,247</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">총 인원</p>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-signal-danger">12.8%</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">이직률</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-signal-success">94.2%</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">핵심인재 유지</p>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-signal-warning">38.5%</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">인건비율</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
