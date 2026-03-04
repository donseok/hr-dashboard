'use client';

import { cn } from '@/lib/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  tooltip?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  subtitle,
  tooltip,
  isLoading = false,
  isEmpty = false,
  error = null,
  toolbar,
  children,
  className,
}: ChartContainerProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <div className="flex items-center gap-1">
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-label="도움말">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {toolbar && <div className="flex items-center gap-1">{toolbar}</div>}
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        {isLoading ? (
          <ChartSkeleton />
        ) : error ? (
          <ChartError message={error} />
        ) : isEmpty ? (
          <ChartEmpty />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex items-end gap-2 h-[200px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

function ChartError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] text-center">
      <svg className="h-10 w-10 text-signal-danger mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] text-center">
      <svg className="h-10 w-10 text-neutral-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">데이터가 없습니다</p>
    </div>
  );
}
