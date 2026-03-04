'use client';

import { cn } from '@/lib/cn';
import type { ActiveFilter } from '@/types/filter';

interface FilterChipsProps {
  filters: ActiveFilter[];
  onRemove: (filter: ActiveFilter) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterChips({ filters, onRemove, onClearAll, className }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {filters.map((filter, i) => (
        <span
          key={`${filter.key}-${filter.value}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-primary-50 border border-primary-200 px-2.5 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300"
        >
          <span className="text-primary-400 font-medium">{filter.label}:</span>
          {filter.displayValue}
          <button
            onClick={() => onRemove(filter)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-primary-100 transition-colors"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 underline"
        >
          전체 해제
        </button>
      )}
    </div>
  );
}
