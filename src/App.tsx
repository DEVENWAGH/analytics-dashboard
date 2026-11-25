import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LoadingState } from "@/components/ui/LoadingState";
import OverviewPage from "@/app/overview/page";

const AnalyticsPage = lazy(() => import("@/app/analytics/page"));
const TransactionsPage = lazy(() => import("@/app/transactions/page"));
const CustomersPage = lazy(() => import("@/app/customers/page"));
const SettingsPage = lazy(() => import("@/app/settings/page"));
const ProgressPage = lazy(() => import("@/app/progress/page"));

export default function App() {
  return (
    <ThemeProvider>
      <DashboardShell>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </Suspense>
      </DashboardShell>
    </ThemeProvider>
  );
}
