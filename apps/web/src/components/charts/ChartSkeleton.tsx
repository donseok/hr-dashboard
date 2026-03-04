import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

interface ChartSkeletonProps {
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  className?: string;
}

export function ChartSkeleton({ type = 'bar', height = 200, className }: ChartSkeletonProps) {
  if (type === 'pie') {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={cn('flex flex-col gap-2', className)} style={{ height }}>
        <Skeleton className="h-full w-full rounded-md" />
        <div className="flex justify-between px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2', className)} style={{ height }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ height: `${20 + Math.random() * 80}%` }}
        />
      ))}
    </div>
  );
}
