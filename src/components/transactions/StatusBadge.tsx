import type { TransactionStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

const styles: Record<TransactionStatus, string> = {
  completed: "bg-success-soft text-success",
  pending: "bg-warning-soft text-warning",
  failed: "bg-danger-soft text-danger",
  refunded: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
