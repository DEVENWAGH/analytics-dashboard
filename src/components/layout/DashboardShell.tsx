"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { DashboardProvider } from "@/context/DashboardContext";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Overview",
    subtitle: "Revenue, orders, and activity at a glance",
  },
  "/overview": {
    title: "Overview",
    subtitle: "Revenue, orders, and activity at a glance",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Trends across the selected date range",
  },
  "/transactions": {
    title: "Transactions",
    subtitle: "Search, filter, and page through orders",
  },
  "/customers": {
    title: "Customers",
    subtitle: "People buying from your storefront",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Workspace preferences and demo controls",
  },
  "/progress": {
    title: "Task progress",
    subtitle: "Monday to Friday assignment checklist",
  },
};

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = titles[pathname] ?? { title: "Dashboard", subtitle: "" };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[var(--sidebar-width)]">
          <Sidebar />
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 cursor-pointer bg-foreground/30 backdrop-blur-[1px]"
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative flex h-full w-[min(85vw,var(--sidebar-width))] flex-col bg-card shadow-lg">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[8px] border border-border bg-card text-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="lg:pl-[var(--sidebar-width)]">
          <TopNavbar
            title={meta.title}
            subtitle={meta.subtitle}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="px-4 py-5 sm:px-6 sm:py-6">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
