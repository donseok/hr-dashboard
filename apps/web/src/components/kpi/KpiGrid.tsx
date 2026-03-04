'use client';

import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface KpiGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses = {
  2: 'grid-cols-1 tablet:grid-cols-2',
  3: 'grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3',
  4: 'grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4',
};

export function KpiGrid({ children, columns = 4, className }: KpiGridProps) {
  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {children}
    </div>
  );
}
