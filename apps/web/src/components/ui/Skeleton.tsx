import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700', className)}
      {...props}
    />
  );
}
