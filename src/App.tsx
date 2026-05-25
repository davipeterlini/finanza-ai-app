import React, { useState, lazy, Suspense } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { useAuth } from "./contexts/AuthContext";
import { LoginScreen } from "./components/auth/LoginScreen";
import type { View } from "./types";

// Lazy load views
const DashboardView = lazy(() =>
  import("./components/views/DashboardView").then((m) => ({ default: m.DashboardView }))
);
const TransactionsView = lazy(() =>
  import("./components/views/TransactionsView").then((m) => ({ default: m.TransactionsView }))
);
const BudgetsView = lazy(() =>
  import("./components/views/BudgetsView").then((m) => ({ default: m.BudgetsView }))
);
const GoalsView = lazy(() =>
  import("./components/views/GoalsView").then((m) => ({ default: m.GoalsView }))
);
const OpenFinanceView = lazy(() =>
  import("./components/views/OpenFinanceView").then((m) => ({ default: m.OpenFinanceView }))
);
const AIAdvisorView = lazy(() =>
  import("./components/views/AIAdvisorView").then((m) => ({ default: m.AIAdvisorView }))
);
const SettingsView = lazy(() =>
  import("./components/views/SettingsView").then((m) => ({ default: m.SettingsView }))
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
  </div>
);

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>("dashboard");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={<LoadingSpinner />}>
            {currentView === "dashboard" && <DashboardView />}
            {currentView === "transactions" && <TransactionsView />}
            {currentView === "budgets" && <BudgetsView />}
            {currentView === "goals" && <GoalsView />}
            {currentView === "openfinance" && <OpenFinanceView />}
            {currentView === "ai-advisor" && <AIAdvisorView />}
            {currentView === "settings" && <SettingsView />}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default App;