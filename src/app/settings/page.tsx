import { useDashboard } from "@/context/DashboardContext";
import { useAppTheme } from "@/components/theme/useAppTheme";
import type { AppTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const themeOptions: { value: AppTheme; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "Stripe / Linear inspired, default" },
  { value: "dark", label: "Dark", description: "Low-glare for long sessions" },
  { value: "retro", label: "Retro", description: "8-bit console panels and pixel type" },
];

export default function SettingsPage() {
  const { simulateError, retry, resetRange } = useDashboard();
  const { theme, setTheme, mounted } = useAppTheme();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <section className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
        <h2 className="text-[13px] font-semibold text-foreground">Workspace</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Northline is a demo analytics workspace built for the Mahity React assignment.
        </p>

        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[8px] border border-border bg-background p-3">
            <dt className="text-[11px] text-muted-foreground">Stack</dt>
            <dd className="mt-1 text-[13px] font-medium">
              React 19, Tailwind, Recharts, D3
            </dd>
          </div>
          <div className="rounded-[8px] border border-border bg-background p-3">
            <dt className="text-[11px] text-muted-foreground">Routing</dt>
            <dd className="mt-1 text-[13px] font-medium">React Router DOM</dd>
          </div>
          <div className="rounded-[8px] border border-border bg-background p-3">
            <dt className="text-[11px] text-muted-foreground">Data source</dt>
            <dd className="mt-1 text-[13px] font-medium">Sample dataset</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
        <h2 className="text-[13px] font-semibold text-foreground">Appearance</h2>
        <div
          className="mt-3 grid gap-2 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Theme"
        >
          {themeOptions.map((option) => {
            const active = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "cursor-pointer rounded-[8px] border p-3 text-left transition-colors",
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                <span className="block text-[13px] font-medium text-foreground">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
        <h2 className="text-[13px] font-semibold text-foreground">Demo controls</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Use these to preview loading, error handling, and date filter resets during
          review.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={retry}
            className="cursor-pointer rounded-[8px] border border-border bg-card px-3 py-2 text-[13px] font-medium hover:bg-muted"
          >
            Reload data
          </button>
          <button
            type="button"
            onClick={simulateError}
            className="cursor-pointer rounded-[8px] border border-danger/30 bg-danger-soft px-3 py-2 text-[13px] font-medium text-danger hover:opacity-90"
          >
            Simulate error
          </button>
          <button
            type="button"
            onClick={resetRange}
            className="cursor-pointer rounded-[8px] bg-accent px-3 py-2 text-[13px] font-medium text-white hover:bg-accent-hover"
          >
            Reset date filter
          </button>
        </div>
      </section>
    </div>
  );
}
