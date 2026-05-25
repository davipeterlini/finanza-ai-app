import React, { useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";
import { storage } from "../../services/storage";
import { type Goal } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export const GoalsView: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(storage.getGoals());
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.targetAmount || !form.deadline) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    const goal: Goal = {
      id: crypto.randomUUID(),
      name: form.name,
      targetAmount: parseFloat(form.targetAmount),
      currentAmount: parseFloat(form.currentAmount) || 0,
      deadline: form.deadline,
    };

    const updated = [...goals, goal];
    storage.setGoals(updated);
    setGoals(updated);
    setForm({ name: "", targetAmount: "", currentAmount: "", deadline: "" });
    setShowForm(false);
    showToast("Meta criada!", "success");
  };

  const handleDelete = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    storage.setGoals(updated);
    setGoals(updated);
    showToast("Meta removida", "success");
  };

  const handleAddSavings = (goal: Goal) => {
    const amount = prompt("Quanto deseja adicionar?");
    if (!amount) return;

    const updated = goals.map((g) =>
      g.id === goal.id ? { ...g, currentAmount: g.currentAmount + parseFloat(amount) } : g
    );
    storage.setGoals(updated);
    setGoals(updated);
    showToast("Economia adicionada!", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Metas Financeiras</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Meta
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Nova Meta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome da meta (ex: Viagem de ferias)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="number"
              placeholder="Valor alvo (R$)"
              value={form.targetAmount}
              onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="number"
              placeholder="Valor atual (R$)"
              value={form.currentAmount}
              onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
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

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.length === 0 ? (
          <p className="text-slate-400 text-center py-12 col-span-3">Nenhuma meta definida</p>
        ) : (
          goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={goal.id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Target size={20} className="text-emerald-400" />
                    </div>
                    <span className="font-semibold text-white">{goal.name}</span>
                  </div>
                  <button onClick={() => handleDelete(goal.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progresso</span>
                    <span className="text-emerald-400 font-medium">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <span className="text-slate-400">
                    R$ {goal.currentAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-slate-400">
                    R$ {goal.targetAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${daysLeft < 30 ? "text-amber-400" : "text-slate-400"}`}>
                    {daysLeft > 0 ? `${daysLeft} dias restantes` : "Prazo vencido"}
                  </span>
                  <button
                    onClick={() => handleAddSavings(goal)}
                    className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};