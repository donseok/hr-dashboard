'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { performanceInsights } from '@/mocks/performance';

const signalStyles = {
  success: { dot: 'bg-signal-success' },
  warning: { dot: 'bg-signal-warning' },
  danger: { dot: 'bg-signal-danger' },
  info: { dot: 'bg-primary' },
};

export default function PerformanceInsightsSlot() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">캘리브레이션 제안</CardTitle>
            <Badge variant="warning" className="text-[10px]">
              2건 검토 필요
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {[
              {
                dept: '영업본부',
                issue: '팀별 S등급 편차 과대',
                detail: '국내영업1팀 22.3% vs 국내영업2팀 10.5%',
                severity: 'high',
              },
              {
                dept: '경영지원',
                issue: 'D등급 비율 상위',
                detail: '전사 평균 5.6% 대비 6.7%로 1.1%p 초과',
                severity: 'medium',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  item.severity === 'high'
                    ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20'
                    : 'border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={item.severity === 'high' ? 'warning' : 'neutral'}
                    className="text-[10px]"
                  >
                    {item.dept}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {item.issue}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-700 pt-4">
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              성과 인사이트
            </p>
            <div className="space-y-3">
              {performanceInsights.map((insight, i) => {
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">등급 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { grade: 'S', label: '탁월', count: 187, pct: 15.2, color: 'bg-blue-500' },
              { grade: 'A', label: '우수', count: 325, pct: 26.4, color: 'bg-sky-500' },
              { grade: 'B', label: '양호', count: 478, pct: 38.8, color: 'bg-emerald-500' },
              { grade: 'C', label: '보통', count: 191, pct: 15.5, color: 'bg-amber-500' },
              { grade: 'D', label: '개선필요', count: 66, pct: 5.4, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.grade} className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 w-6">
                  {item.grade}
                </span>
                <div className="flex-1 h-5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono tabular-nums w-16 text-right">
                  {item.count}명 ({item.pct}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
