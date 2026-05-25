import React from "react";
import { Landmark, Plus, RefreshCw, Unlink, ExternalLink } from "lucide-react";
import { storage } from "../../services/storage";
import { type BankConnection } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export const OpenFinanceView: React.FC = () => {
  const [connections, setConnections] = React.useState<BankConnection[]>(storage.getBankConnections());
  const [isConnecting, setIsConnecting] = React.useState(false);
  const { showToast } = useToast();

  // Mock banks list (in real app, this would come from Pluggy API)
  const banks = [
    { id: "nubank", name: "Nubank", logo: "N" },
    { id: "itau", name: "Itau", logo: "I" },
    { id: "bradesco", name: "Bradesco", logo: "B" },
    { id: "inter", name: "Inter", logo: "INT" },
    { id: "santander", name: "Santander", logo: "S" },
    { id: "btg", name: "BTG Pactual", logo: "BTG" },
  ];

  const handleConnect = (bankId: string) => {
    setIsConnecting(true);
    // Simulate OAuth flow
    setTimeout(() => {
      const bank = banks.find((b) => b.id === bankId);
      const newConnection: BankConnection = {
        id: crypto.randomUUID(),
        bankId,
        bankName: bank?.name || "Unknown",
        connectedAt: new Date(),
        accounts: [
          { id: "1", type: "checking", name: "Conta Corrente", balance: 5000, currency: "BRL" },
        ],
        cards: [
          { id: "1", name: "Cartao de Credito", lastDigits: "1234", balance: 1500, creditLimit: 10000 },
        ],
      };

      const updated = [...connections, newConnection];
      storage.setBankConnections(updated);
      setConnections(updated);
      setIsConnecting(false);
      showToast(`${bank?.name} conectado com sucesso!`, "success");
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    const updated = connections.filter((c) => c.id !== id);
    storage.setBankConnections(updated);
    setConnections(updated);
    showToast("Conexao removida", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Open Finance</h2>
          <p className="text-slate-400 text-sm mt-1">Conecte suas contas bancarias para sincronizacao automatica</p>
        </div>
      </div>

      {/* Connected Banks */}
      {connections.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Contas Conectadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((conn) => (
              <div key={conn.id} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Landmark size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{conn.bankName}</p>
                      <p className="text-xs text-slate-400">
                        Conectado em {new Date(conn.connectedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect(conn.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Unlink size={18} />
                  </button>
                </div>

                {/* Accounts */}
                {conn.accounts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Contas</p>
                    {conn.accounts.map((acc) => (
                      <div key={acc.id} className="flex justify-between text-sm">
                        <span className="text-slate-300">{acc.name}</span>
                        <span className="text-emerald-400 font-medium">
                          R$ {acc.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cards */}
                {conn.cards.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-slate-400">Cartoes</p>
                    {conn.cards.map((card) => (
                      <div key={card.id} className="flex justify-between text-sm">
                        <span className="text-slate-300">{card.name} ****{card.lastDigits}</span>
                        <span className="text-red-400 font-medium">
                          R$ {card.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Banks */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Conectar Nova Conta</h3>
        <p className="text-slate-400 text-sm mb-6">
          Selecione seu banco para iniciar a conexao via Open Finance. Todas as informacoes sao criptografadas.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {banks.map((bank) => {
            const isConnected = connections.some((c) => c.bankId === bank.id);
            return (
              <button
                key={bank.id}
                onClick={() => !isConnected && !isConnecting && handleConnect(bank.id)}
                disabled={isConnected || isConnecting}
                className={`p-4 rounded-xl border transition-all ${
                  isConnected
                    ? "bg-emerald-500/10 border-emerald-500/30 cursor-default"
                    : "bg-white/[0.03] border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.05]"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">{bank.logo}</span>
                </div>
                <p className="text-sm text-center text-white font-medium">{bank.name}</p>
                {isConnected && (
                  <p className="text-xs text-center text-emerald-400 mt-1">Conectado</p>
                )}
              </button>
            );
          })}
        </div>

        {isConnecting && (
          <div className="flex items-center justify-center gap-3 mt-6 text-emerald-400">
            <RefreshCw size={20} className="animate-spin" />
            <span>Conectando...</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Sobre o Open Finance</h3>
        <div className="space-y-3 text-sm text-slate-400">
          <p>
            O Open Finance e um sistema do Banco Central do Brasil que permite o compartilhamento
            de dados entre instituicoes financeiras com seu consentimento.
          </p>
          <p>
            Atraves do Pluggy API, conectamos com mais de 200 instituicoes incluindo Nubank,
            Itau, Bradesco, Inter, Santander, BTG Pactual e muitas outras.
          </p>
          <div className="flex items-center gap-2 mt-4 text-emerald-400">
            <ExternalLink size={16} />
            <span className="text-sm">Dados sincronizados dos ultimos 12 meses</span>
          </div>
        </div>
      </div>
    </div>
  );
};