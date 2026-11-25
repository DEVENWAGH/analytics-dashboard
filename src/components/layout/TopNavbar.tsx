"use client";

import { Bell, Menu, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

type TopNavbarProps = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
};

export function TopNavbar({ title, subtitle, onMenuClick }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[var(--navbar-height)] items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] border border-border bg-card text-foreground transition-colors hover:bg-muted lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="hidden truncate text-[12px] text-muted-foreground sm:block">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="relative hidden md:block">
          <span className="sr-only">Search</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search…"
            className="h-9 w-56 rounded-[8px] border border-border bg-background pr-3 pl-8 text-[13px] text-foreground outline-none transition focus:border-accent"
          />
        </label>

        <ThemeToggle />

        <button
          type="button"
          className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] border border-border bg-card text-foreground transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        <div className="ml-1 flex items-center gap-2 rounded-[8px] border border-border bg-card py-1 pr-2.5 pl-1">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white"
            aria-hidden
          >
            DW
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-medium leading-none text-foreground">
              Deven Wagh
            </p>
            <p className="mt-0.5 text-[11px] leading-none text-muted-foreground">
              Candidate
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
