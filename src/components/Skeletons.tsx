export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="skeleton-shimmer h-5 w-32" />
          <div className="skeleton-shimmer h-3 w-20" />
        </div>
        <div className="skeleton-shimmer h-7 w-14 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        <div className="skeleton-shimmer h-5 w-24 rounded-full" />
        <div className="skeleton-shimmer h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton-shimmer h-3 w-full" />
      <div className="skeleton-shimmer h-9 w-full rounded-lg" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="skeleton-shimmer h-4 w-48" />
            <div className="skeleton-shimmer h-3 w-24" />
          </div>
          <div className="skeleton-shimmer h-5 w-5 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
