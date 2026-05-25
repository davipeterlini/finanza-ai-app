import React from "react";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  Landmark,
  Sparkles,
  Settings,
  Menu,
} from "lucide-react";
import type { View } from "../../types";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transacoes", icon: Receipt },
  { id: "budgets", label: "Orcamentos", icon: PiggyBank },
  { id: "goals", label: "Metas", icon: Target },
  { id: "openfinance", label: "Open Finance", icon: Landmark },
  { id: "ai-advisor", label: "Assistente IA", icon: Sparkles },
  { id: "settings", label: "Configuracoes", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={`bg-slate-800/50 backdrop-blur-xl border-r border-white/[0.05] flex flex-col flex-shrink-0 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
        {!isCollapsed && (
          <span className="font-bold text-emerald-400 text-lg">Finanza</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon size={20} className={isActive ? "text-white" : ""} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-white/[0.05]">
          <div className="glass-card p-3">
            <p className="text-xs text-slate-400 mb-1">Saldo Disponivel</p>
            <p className="text-lg font-bold text-emerald-400">R$ 0,00</p>
          </div>
        </div>
      )}
    </aside>
  );
};