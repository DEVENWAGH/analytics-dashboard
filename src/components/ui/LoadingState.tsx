export function LoadingState({ label = "Loading dashboard…" }: { label?: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-[10px] border border-border bg-card p-5"
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded-[6px] bg-muted" />
          <div className="h-3 w-52 animate-pulse rounded-[6px] bg-muted/70" />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="h-2 w-2 animate-ping rounded-full bg-accent" aria-hidden />
          <span>{label}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-[8px] border border-border/60 bg-background/50 p-4">
          <div className="flex items-end gap-2 pt-4">
            {[42, 58, 48, 70, 62, 78, 72, 88].map((height, idx) => (
              <div
                key={idx}
                className="flex-1 animate-pulse rounded-t-[4px] bg-muted"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <div className="h-3 w-2/3 animate-pulse rounded-[6px] bg-muted/70" />
        </div>

        <div className="space-y-2.5 rounded-[8px] border border-border/60 bg-background/50 p-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 animate-pulse rounded-[6px] bg-muted" />
                  <div className="h-2.5 w-20 animate-pulse rounded-[6px] bg-muted/70" />
                </div>
              </div>
              <div className="h-3 w-14 animate-pulse rounded-[6px] bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[10px] border border-border bg-card p-4"
        >
          <div className="flex items-start justify-between">
            <div className="h-3 w-16 animate-pulse rounded-[6px] bg-muted" />
            <div className="h-8 w-8 animate-pulse rounded-[8px] bg-muted" />
          </div>
          <div className="mt-3 h-7 w-24 animate-pulse rounded-[6px] bg-muted" />
          <div className="mt-3 flex items-center gap-2">
            <div className="h-4 w-14 animate-pulse rounded-[6px] bg-muted/80" />
            <div className="h-3 w-20 animate-pulse rounded-[6px] bg-muted/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
