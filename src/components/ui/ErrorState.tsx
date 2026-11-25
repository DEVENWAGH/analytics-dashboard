import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-[10px] border border-danger/20 bg-danger-soft px-6 text-center"
      role="alert"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <p className="text-[14px] font-medium text-foreground">Something went wrong</p>
        <p className="mt-1 max-w-md text-[13px] text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-[8px] bg-foreground px-3.5 py-2 text-[13px] font-medium text-card transition hover:opacity-90"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
