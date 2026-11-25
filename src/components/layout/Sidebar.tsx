"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, utilityNav } from "./nav";

type SidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-[var(--sidebar-width)] flex-col border-r border-border bg-card",
        className,
      )}
    >
      <div className="flex h-[var(--navbar-height)] items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent text-white">
          <Activity className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold tracking-tight text-foreground">
            Northline
          </p>
          <p className="truncate text-[11px] text-muted-foreground">Analytics</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4" aria-label="Primary">
        <div>
          <p className="mb-2 px-2 text-[11px] font-medium text-muted-foreground">
            Workspace
          </p>
          <ul className="space-y-0.5">
            {mainNav.map((item) => {
              const active =
                item.href === "/overview"
                  ? pathname === "/" ||
                    pathname === "/overview" ||
                    pathname.startsWith("/overview/")
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-colors duration-150",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                      )}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-2 text-[11px] font-medium text-muted-foreground">
            Assignment
          </p>
          <ul className="space-y-0.5">
            {utilityNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] font-medium transition-colors duration-150",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-[10px] border border-border bg-muted px-3 py-2.5">
          <p className="text-[12px] font-medium text-foreground">Mahity assignment</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            Due Saturday 28 Nov. Track checklist under Task progress.
          </p>
        </div>
      </div>
    </aside>
  );
}
