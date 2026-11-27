import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Bell, CheckCircle2, Clock, Menu, Search, X } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { ThemeToggle } from "./ThemeToggle";

type TopNavbarProps = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
};

export function TopNavbar({ title, subtitle, onMenuClick }: TopNavbarProps) {
  const { search, setSearch, setStatus, transactions, range } = useDashboard();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [readAll, setReadAll] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const searchActiveOnCurrentPage =
    normalizedPath === "/" ||
    normalizedPath === "/overview" ||
    normalizedPath === "/transactions" ||
    normalizedPath === "/customers";

  const alerts = useMemo(() => {
    const failedCount = transactions.filter((t) => t.status === "failed").length;
    const pendingCount = transactions.filter((t) => t.status === "pending").length;
    return { failedCount, pendingCount };
  }, [transactions]);

  const hasUnread = !readAll && (alerts.failedCount > 0 || alerts.pendingCount > 0);

  useEffect(() => {
    if (!notifOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotifOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [notifOpen]);

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!searchActiveOnCurrentPage) {
      navigate("/transactions");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-[var(--navbar-height)] items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-border bg-card text-foreground transition-colors hover:bg-muted lg:hidden"
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
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <label className="relative block">
            <span className="sr-only">Search orders or customers</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders or customers…"
              className="h-9 w-56 rounded-[8px] border border-border bg-background pr-8 pl-8 text-[13px] text-foreground outline-none transition focus:border-accent"
            />
          </label>
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 inline-flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          ) : null}
        </form>

        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((open) => !open)}
            aria-expanded={notifOpen}
            aria-haspopup="dialog"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-border bg-card text-foreground transition-colors hover:bg-muted sm:h-9 sm:w-9"
          >
            <Bell className="h-4 w-4" />
            {hasUnread ? (
              <span
                className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-accent sm:top-2 sm:right-2"
                aria-hidden
              />
            ) : null}
          </button>

          {notifOpen ? (
            <div
              role="dialog"
              aria-label="Workspace notifications"
              className="absolute top-full right-0 z-30 mt-2 w-72 rounded-[10px] border border-border bg-card p-3 shadow-xs sm:w-80"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <p className="text-[12px] font-semibold text-foreground">Notifications</p>
                {hasUnread ? (
                  <button
                    type="button"
                    onClick={() => setReadAll(true)}
                    className="cursor-pointer text-[11px] font-medium text-accent hover:underline"
                  >
                    Mark all read
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-success">
                    <CheckCircle2 className="h-3 w-3" aria-hidden />
                    Caught up
                  </span>
                )}
              </div>

              <ul className="mt-2 space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("failed");
                      setNotifOpen(false);
                      navigate("/transactions");
                    }}
                    className="flex w-full cursor-pointer items-start gap-2.5 rounded-[8px] px-2.5 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-foreground">
                        {alerts.failedCount} failed transaction
                        {alerts.failedCount === 1 ? "" : "s"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        View filtered failed orders in Transactions
                      </p>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("pending");
                      setNotifOpen(false);
                      navigate("/transactions");
                    }}
                    className="flex w-full cursor-pointer items-start gap-2.5 rounded-[8px] px-2.5 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-foreground">
                        {alerts.pendingCount} pending settlement
                        {alerts.pendingCount === 1 ? "" : "s"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {range.start && range.end
                          ? `Active filter: ${range.start} to ${range.end}`
                          : "Across all 2026 sample orders"}
                      </p>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-[8px] border border-border bg-card p-1 sm:ml-1 sm:py-1 sm:pr-2.5 sm:pl-1">
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
              Analytics Dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
