import { Skeleton } from '@/components/ui/Skeleton';

export default function LifecycleLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6">
        <div className="desktop:col-span-2 space-y-6">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[360px] rounded-lg" />
          <Skeleton className="h-[360px] rounded-lg" />
        </div>
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    </div>
  );
}
