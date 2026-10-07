export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-parchment/60 ${className}`} />;
}

export function BookCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="mt-2.5 h-4 w-4/5" />
      <Skeleton className="mt-1.5 h-3 w-1/2" />
      <Skeleton className="mt-2 h-3 w-2/3" />
    </div>
  );
}