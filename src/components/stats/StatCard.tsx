import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
};

export function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  const positive = change >= 0;

  return (
    <article className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-[22px] font-semibold tracking-tight tabular text-foreground">
            {value}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-accent-soft text-accent">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
            positive
              ? "bg-success-soft text-success"
              : "bg-danger-soft text-danger",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          ) : (
            <ArrowDownRight className="h-3 w-3" aria-hidden />
          )}
          {formatPercent(change)}
        </span>
        <span className="text-[11px] text-muted-foreground">vs prior period</span>
      </div>
    </article>
  );
}
