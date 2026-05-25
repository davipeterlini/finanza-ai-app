import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut } from "lucide-react";

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="h-16 bg-slate-800/50 backdrop-blur-xl border-b border-white/[0.05] flex items-center px-6 justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <h1 className="text-lg font-bold text-white">Finanza AI</h1>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-emerald-500/30"
            />
          )}
          <div className="hidden md:block">
            <span className="text-sm text-slate-400">{user.email}</span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      )}
    </header>
  );
};