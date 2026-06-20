export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="در حال بارگذاری محصولات"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-card border border-line-card bg-surface shadow-card"
        >
          <div className="aspect-square animate-pulse bg-surface-2 motion-reduce:animate-none" />
          <div className="flex flex-col gap-2 p-3">
            <div className="h-4 w-3/4 animate-pulse rounded-chip bg-surface-2 motion-reduce:animate-none" />
            <div className="h-4 w-1/2 animate-pulse rounded-chip bg-surface-2 motion-reduce:animate-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
