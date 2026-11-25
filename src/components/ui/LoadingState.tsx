export function LoadingState({ label = "Loading dashboard…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-[10px] border border-border bg-card"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-[13px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[108px] animate-pulse rounded-[10px] border border-border bg-card"
        />
      ))}
    </div>
  );
}
