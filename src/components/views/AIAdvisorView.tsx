import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Lightbulb, Loader } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { AI_ADVICE_CACHE_DURATION } from "../../constants";
import { CONFIG } from "../../config";

interface AIMessage {
  id: string;
  tip: string;
  category: string;
}

export const AIAdvisorView: React.FC = () => {
  const { transactions, monthlyIncome, monthlyExpenses } = useDashboardData();
  const [advice, setAdvice] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  // Check cache before fetching
  const canFetch = () => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch > AI_ADVICE_CACHE_DURATION;
  };

  const generateAdvice = async () => {
    if (!canFetch() || !CONFIG.GEMINI_API_KEY) {
      if (!CONFIG.GEMINI_API_KEY) {
        // Use mock advice if no API key
        setAdvice(getMockAdvice());
        return;
      }
      return;
    }

    setIsLoading(true);

    try {
      // Build context from transactions
      const context = {
        monthlyIncome,
        monthlyExpenses,
        topCategories: getTopCategories(),
        recentTransactions: transactions.slice(-10),
      };

      // Call Gemini API
      const response = await fetch(
        `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Voce e um assistente financeiro virtual especializados em financas pessoais para brasileiros.
Analise estes dados e gere 3 dicas práticas em português brasileiro:

Renda mensal: R$ ${context.monthlyIncome}
Despesas mensais: R$ ${context.monthlyExpenses}
Saldo: R$ ${context.monthlyIncome - context.monthlyExpenses}

Categorias com mais gastos: ${JSON.stringify(context.topCategories)}

Transacoes recentes: ${context.recentTransactions.map(t => `${t.type === 'income' ? '+' : '-'}${t.description}: R$ ${t.amount}`).join(', ')}

Retorne apenas um JSON com array de 3 dicas:
[{"tip": "texto da dica 1", "category": "categoria1"}, {"tip": "texto da dica 2", "category": "categoria2"}, {"tip": "texto da dica 3", "category": "categoria3"}]`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Parse JSON response
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        setAdvice(JSON.parse(jsonMatch[0]));
      } else {
        setAdvice(getMockAdvice());
      }

      setLastFetch(Date.now());
    } catch (error) {
      console.error("AI Advisor error:", error);
      setAdvice(getMockAdvice());
    } finally {
      setIsLoading(false);
    }
  };

  const getTopCategories = (): Record<string, number> => {
    const categories: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    return Object.fromEntries(
      Object.entries(categories).sort(([, a], [, b]) => b - a).slice(0, 5)
    );
  };

  const getMockAdvice = (): AIMessage[] => {
    const balance = monthlyIncome - monthlyExpenses;
    const percentage = monthlyExpenses > 0 ? ((monthlyExpenses / monthlyIncome) * 100).toFixed(0) : 0;

    const tips = [];

    if (balance > 0) {
      tips.push({
        id: "1",
        tip: `Voce esta economizando R$ ${balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} por mes. Que tal reservar 20% para emergencias e investir o restante?`,
        category: "Economia",
      });
    } else {
      tips.push({
        id: "1",
        tip: "Suas despesas estao superando sua renda. Revise gastos nao essenciais e considere um orcamento mais rigoroso.",
        category: "Orcamento",
      });
    }

    if (parseInt(String(percentage)) > 70) {
      tips.push({
        id: "2",
        tip: `Voce esta gastando ${percentage}% da sua renda em despesas. Tente reduzir gastos fixos ou buscar renda adicional.`,
        category: "Alerta",
      });
    } else {
      tips.push({
        id: "2",
        tip: "Parabens! Seus gastos estao controlados. Continue assim mantendo um orcamento mensal.",
        category: "Parabens",
      });
    }

    tips.push({
      id: "3",
      tip: "Considere destinar 10% da renda para dízimo ou ofertas, conforme princípios financeiros saudáveis.",
      category: "Espiritual",
    });

    return tips;
  };

  useEffect(() => {
    if (canFetch() && transactions.length > 0) {
      generateAdvice();
    } else if (transactions.length === 0) {
      setAdvice(getMockAdvice());
    }
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Economia":
        return "text-emerald-400 bg-emerald-500/20";
      case "Orcamento":
        return "text-blue-400 bg-blue-500/20";
      case "Alerta":
        return "text-amber-400 bg-amber-500/20";
      case "Parabens":
        return "text-purple-400 bg-purple-500/20";
      case "Espiritual":
        return "text-teal-400 bg-teal-500/20";
      default:
        return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assistente IA</h2>
          <p className="text-slate-400 text-sm mt-1">Dicas personalizadas baseadas no seu perfil financeiro</p>
        </div>
        <button
          onClick={generateAdvice}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? <Loader size={20} className="animate-spin" /> : <RefreshCw size={20} />}
          Atualizar
        </button>
      </div>

      {/* Advice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {advice.length === 0 ? (
          <p className="text-slate-400 text-center py-12 col-span-3">
            {transactions.length === 0
              ? "Adicione transacoes para receber dicas personalizadas"
              : "Carregando dicas..."}
          </p>
        ) : (
          advice.map((msg) => (
            <div key={msg.id} className="glass-card p-6 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(msg.category)}`}>
                  <Lightbulb size={24} />
                </div>
                <div className="flex-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(msg.category)}`}>
                    {msg.category}
                  </span>
                  <p className="text-white leading-relaxed">{msg.tip}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Sobre o Assistente</h3>
            <p className="text-sm text-slate-400">Powered by Google Gemini AI</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          O assistente analisa suas transacoes, orcamentos e metas para gerar dicas personalizadas
          em portugues brasileiro. As respostas sao cachesadas por 5 minutos para otimizar
          o uso da API. Configure sua chave GEMINI_API_KEY para ativar a IA real.
        </p>
      </div>

      {/* Cache indicator */}
      {lastFetch && (
        <p className="text-center text-slate-500 text-xs">
          Ultima atualizacao: {new Date(lastFetch).toLocaleString("pt-BR")} (cache: 5 min)
        </p>
      )}
    </div>
  );
};