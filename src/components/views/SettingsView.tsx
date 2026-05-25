import React from "react";
import { User, Moon, Bell, Database, Shield, Info } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { STORAGE_KEYS } from "../../constants";
import { useToast } from "../../contexts/ToastContext";

export const SettingsView: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Gather all data
      const transactions = JSON.parse(localStorage.getItem("finanza_transactions") || "[]");
      const budgets = JSON.parse(localStorage.getItem("finanza_budgets") || "[]");
      const goals = JSON.parse(localStorage.getItem("finanza_goals") || "[]");
      const connections = JSON.parse(localStorage.getItem("finanza_bank_connections") || "[]");

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: user ? { name: user.name, email: user.email } : null,
        transactions,
        budgets,
        goals,
        bankConnections: connections,
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finanza-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showToast("Dados exportados com sucesso!", "success");
    } catch (error) {
      showToast("Erro ao exportar dados", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = () => {
    if (confirm("Tem certeza que deseja limpar todos os dados? Esta acao nao pode ser desfeita.")) {
      localStorage.removeItem("finanza_transactions");
      localStorage.removeItem("finanza_budgets");
      localStorage.removeItem("finanza_goals");
      localStorage.removeItem("finanza_bank_connections");
      showToast("Dados limpos com sucesso!", "success");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Configuracoes</h2>

      {/* Profile */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <User size={24} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Perfil</h3>
            <p className="text-sm text-slate-400">
              {user ? user.email : "Nao conectado"}
            </p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            {user.avatar && (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Language */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <User size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Idioma</h3>
            <p className="text-sm text-slate-400">Selecione o idioma da aplicacao</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage("pt-BR")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              language === "pt-BR"
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Portugues (BR)
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              language === "en"
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Database size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Gerenciamento de Dados</h3>
            <p className="text-sm text-slate-400">Backup e restauracao de dados</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="btn-primary"
          >
            {isExporting ? "Exportando..." : "Exportar Dados"}
          </button>
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            Limpar Dados
          </button>
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Info size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Sobre o Finanza AI</h3>
            <p className="text-sm text-slate-400">Versao 0.1.0</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          <p>Desenvolvido com React + TypeScript + Vite</p>
          <p>UI moderna com Tailwind CSS e Glassmorphism</p>
          <p>Backend: localStorage com sincronizacao via Google Drive</p>
        </div>
      </div>
    </div>
  );
};