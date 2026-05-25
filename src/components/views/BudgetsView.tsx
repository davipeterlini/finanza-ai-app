import React, { useState } from "react";
import { Plus, Target } from "lucide-react";
import { storage } from "../../services/storage";
import { CATEGORIES, type Budget } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export const BudgetsView: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>(storage.getBudgets());
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [form, setForm] = useState({
    category: "Alimentacao",
    limit: "",
    month: currentMonth,
  });

  const handleSubmit = () => {
    if (!form.limit) {
      showToast("Informe o valor do orcamento", "error");
      return;
    }

    const budget: Budget = {
      id: crypto.randomUUID(),
      category: form.category,
      month: form.month,
      limit: parseFloat(form.limit),
      spent: 0,
    };

    const updated = [...budgets.filter((b) => !(b.category === budget.category && b.month === budget.month)), budget];
    storage.setBudgets(updated);
    setBudgets(updated);
    setForm({ ...form, limit: "" });
    setShowForm(false);
    showToast("Orcamento criado!", "success");
  };

  const calculateSpent = (category: string, month: string): number => {
    const transactions = storage.getTransactions();
    return transactions
      .filter((tx) => tx.category === category && tx.date.startsWith(month) && tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: calculateSpent(b.category, b.month),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orcamentos</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Novo Orcamento
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Novo Orcamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Limite (R$)"
              value={form.limit}
              onChange={(e) => setForm({ ...form, limit: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="btn-primary">Salvar</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Budgets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetsWithSpent.length === 0 ? (
          <p className="text-slate-400 text-center py-12 col-span-2">Nenhum orcamento definido</p>
        ) : (
          budgetsWithSpent.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage > 100;
            return (
              <div key={budget.id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-white">{budget.category}</span>
                  <span className="text-sm text-slate-400">{budget.month}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Gasto</span>
                    <span className={isOverBudget ? "text-red-400" : "text-slate-300"}>
                      R$ {budget.spent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / R$ {budget.limit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                {isOverBudget && (
                  <p className="text-sm text-red-400 font-medium">
                    Excedeu o orcamento em R$ {(budget.spent - budget.limit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};