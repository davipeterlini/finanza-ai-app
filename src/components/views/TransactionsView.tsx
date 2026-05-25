import React, { useState } from "react";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import { storage } from "../../services/storage";
import { CATEGORIES, CATEGORY_KEYWORDS, type Transaction } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export const TransactionsView: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(storage.getTransactions());
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "Outros",
    date: new Date().toISOString().split("T")[0],
  });

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

  const handleSubmit = () => {
    if (!form.description || !form.amount || !form.date) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category: autoCategorize(form.description),
      date: form.date,
    };

    storage.addTransaction(transaction);
    setTransactions(storage.getTransactions());
    setForm({ description: "", amount: "", type: "expense", category: "Outros", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    showToast("Transacao adicionada!", "success");
  };

  const handleDelete = (id: string) => {
    const txs = transactions.filter((t) => t.id !== id);
    localStorage.setItem("finanza_transactions", JSON.stringify(txs));
    setTransactions(txs);
    showToast("Transacao removida", "success");
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transacoes</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Transacao
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar transacoes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Nova Transacao</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Descricao"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <input
              type="number"
              placeholder="Valor (R$)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
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

      {/* Transactions List */}
      <div className="glass-card">
        {filteredTransactions.length === 0 ? (
          <p className="text-slate-400 text-center py-12">Nenhuma transacao encontrada</p>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tx.type === "income" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}>
                    <span className={`text-lg font-bold ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "income" ? "+" : "-"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{tx.description}</p>
                    <p className="text-sm text-slate-400">{tx.category} - {new Date(tx.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-semibold ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.type === "income" ? "+" : "-"}R$ {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <button onClick={() => handleDelete(tx.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};