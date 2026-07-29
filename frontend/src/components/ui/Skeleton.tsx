import { cn } from '@/src/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-muted',
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}