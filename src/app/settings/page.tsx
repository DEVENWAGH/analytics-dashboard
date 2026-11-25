"use client";

import { useState } from "react";
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
  const { simulateError, retry, resetRange, source } = useDashboard();
  const { theme, setTheme, mounted } = useAppTheme();
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  async function reseed() {
    setSeedStatus("Reseeding…");
    const res = await fetch("/api/seed", { method: "POST" });
    const body = (await res.json()) as { seeded?: boolean; error?: string };
    if (!res.ok) {
      setSeedStatus(body.error ?? "Reseed failed.");
      return;
    }
    setSeedStatus("Database reseeded from sample data.");
    retry();
  }

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
            <dd className="mt-1 text-[13px] font-medium">Next.js, Tailwind, Recharts, D3</dd>
          </div>
          <div className="rounded-[8px] border border-border bg-background p-3">
            <dt className="text-[11px] text-muted-foreground">Routing</dt>
            <dd className="mt-1 text-[13px] font-medium">Next.js App Router</dd>
          </div>
          <div className="rounded-[8px] border border-border bg-background p-3">
            <dt className="text-[11px] text-muted-foreground">Data source</dt>
            <dd className="mt-1 text-[13px] font-medium">
              {source === "mongodb"
                ? "MongoDB (localhost)"
                : source === "mock"
                  ? "Mock data (MongoDB offline)"
                  : "Loading…"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[10px] border border-border bg-card p-4 shadow-xs">
        <h2 className="text-[13px] font-semibold text-foreground">Appearance</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Theme">
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
          Use these to show loading, error handling, and the database during review.
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
            onClick={reseed}
            className="cursor-pointer rounded-[8px] border border-border bg-card px-3 py-2 text-[13px] font-medium hover:bg-muted"
          >
            Reseed MongoDB
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

        {seedStatus ? (
          <p className="mt-3 text-[12px] text-muted-foreground" role="status">
            {seedStatus}
          </p>
        ) : null}
      </section>
    </div>
  );
}
