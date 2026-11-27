import { RotateCcw } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function DateRangeFilter() {
  const { range, setRange, resetRange, rangeError } = useDashboard();

  return (
    <section
      className="rounded-[10px] border border-border bg-card p-3 sm:p-4"
      aria-labelledby="date-filter-heading"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="date-filter-heading"
            className="text-[13px] font-semibold text-foreground"
          >
            Date range
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Stats and charts update when both dates are valid.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="block min-w-[150px]">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Start
            </span>
            <input
              type="date"
              value={range.start}
              onChange={(e) => setRange({ ...range, start: e.target.value })}
              className="h-9 w-full cursor-pointer rounded-[8px] border border-border bg-background px-2.5 text-[13px] text-foreground outline-none focus:border-accent"
            />
          </label>

          <label className="block min-w-[150px]">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">
              End
            </span>
            <input
              type="date"
              value={range.end}
              onChange={(e) => setRange({ ...range, end: e.target.value })}
              className="h-9 w-full cursor-pointer rounded-[8px] border border-border bg-background px-2.5 text-[13px] text-foreground outline-none focus:border-accent"
            />
          </label>

          <button
            type="button"
            onClick={resetRange}
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-border bg-card px-3 text-[13px] font-medium text-foreground transition hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </button>
        </div>
      </div>

      {rangeError ? (
        <p className="mt-3 text-[12px] font-medium text-danger" role="alert">
          {rangeError}
        </p>
      ) : null}
    </section>
  );
}
