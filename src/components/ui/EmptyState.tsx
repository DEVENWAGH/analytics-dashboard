import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
