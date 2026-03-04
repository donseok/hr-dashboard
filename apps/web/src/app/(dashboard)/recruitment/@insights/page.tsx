'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { recruitmentInsights } from '@/mocks/recruitment';

const signalStyles = {
  success: { dot: 'bg-signal-success', badge: 'success' as const },
  warning: { dot: 'bg-signal-warning', badge: 'warning' as const },
  danger: { dot: 'bg-signal-danger', badge: 'danger' as const },
  info: { dot: 'bg-primary', badge: 'default' as const },
};

export default function RecruitmentInsightsSlot() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">AI 채용 인사이트</CardTitle>
            <Badge variant="outline" className="text-[10px]">
              AI 분석
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recruitmentInsights.map((insight, i) => {
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
          <CardTitle className="text-sm">빠른 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-primary">142</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">현재 파이프라인</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-signal-success">87.5%</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">오퍼 수락률</p>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-signal-warning">32일</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">평균 소요일</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-lg font-bold font-mono text-secondary">8건</p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">오픈 포지션</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
