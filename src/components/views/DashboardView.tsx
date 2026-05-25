import React from "react";
import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { storage } from "../../services/storage";
import { CATEGORY_KEYWORDS, type Transaction } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export const DashboardView: React.FC = () => {
  const { totalBalance, monthlyIncome, monthlyExpenses, recentTransactions, getBalanceByCategory } = useDashboardData();
  const { showToast } = useToast();
  const [showQuickAdd, setShowQuickAdd] = React.useState(false);
  const [quickAddForm, setQuickAddForm] = React.useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "Outros",
  });

  const balanceByCategory = getBalanceByCategory();
  const categories = Object.keys(balanceByCategory);

  const autoCategorize = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          return category;
        }
      }
    }
    return "Outros";
  };

  const handleQuickAdd = () => {
    if (!quickAddForm.description || !quickAddForm.amount) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      description: quickAddForm.description,
      amount: parseFloat(quickAddForm.amount),
      type: quickAddForm.type,
      category: autoCategorize(quickAddForm.description),
      date: new Date().toISOString(),
    };

    storage.addTransaction(transaction);
    setQuickAddForm({ description: "", amount: "", type: "expense", category: "Outros" });
    setShowQuickAdd(false);
    showToast("Transacao adicionada!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Saldo Total</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Wallet size={20} className="text-emerald-400" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${totalBalance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Receitas do Mes</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            R$ {monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Despesas do Mes</span>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400">
            R$ {monthlyExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => setShowQuickAdd(!showQuickAdd)}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Adicionar Transacao Rapida
      </button>

      {/* Quick Add Form */}
      {showQuickAdd && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Nova Transacao</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Descricao (ex: Mercado Extra)"
              value={quickAddForm.description}
              onChange={(e) => setQuickAddForm({ ...quickAddForm, description: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="number"
              placeholder="Valor (R$)"
              value={quickAddForm.amount}
              onChange={(e) => setQuickAddForm({ ...quickAddForm, amount: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <select
              value={quickAddForm.type}
              onChange={(e) => setQuickAddForm({ ...quickAddForm, type: e.target.value as "income" | "expense" })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
            <button onClick={handleQuickAdd} className="btn-primary">
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Transacoes Recentes</h3>
        {recentTransactions.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Nenhuma transacao registrada</p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === "income" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}>
                    {tx.type === "income" ? (
                      <TrendingUp size={20} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={20} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{tx.description}</p>
                    <p className="text-sm text-slate-400">{tx.category} - {new Date(tx.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <p className={`font-semibold ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                  {tx.type === "income" ? "+" : "-"}R$ {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expenses by Category */}
      {categories.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
          <div className="space-y-3">
            {categories.map((category) => {
              const amount = balanceByCategory[category];
              const percentage = (amount / monthlyExpenses) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{category}</span>
                    <span className="text-slate-400">R$ {amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};