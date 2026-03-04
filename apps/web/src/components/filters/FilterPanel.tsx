'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

interface FilterPanelProps {
  children: ReactNode;
  onReset?: () => void;
  onApply?: () => void;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function FilterPanel({
  children,
  onReset,
  onApply,
  isCollapsible = true,
  defaultOpen = false,
  className,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (isCollapsible && !isOpen) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-1.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          필터
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">필터</h3>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              초기화
            </Button>
          )}
          {isCollapsible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
      {onApply && (
        <div className="flex justify-end mt-3 pt-3 border-t border-neutral-200">
          <Button size="sm" onClick={onApply}>
            적용
          </Button>
        </div>
      )}
    </div>
  );
}
