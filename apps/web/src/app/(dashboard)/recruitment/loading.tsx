import { Skeleton } from '@/components/ui/Skeleton';

export default function RecruitmentLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6">
        <div className="desktop:col-span-2 space-y-6">
          <Skeleton className="h-80 rounded-lg" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-72 rounded-lg" />
            <Skeleton className="h-72 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  );
}
