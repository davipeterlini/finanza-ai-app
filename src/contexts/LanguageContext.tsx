import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "pt-BR" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  "pt-BR": {
    dashboard: "Dashboard",
    transactions: "Transacoes",
    budgets: "Orcamentos",
    goals: "Metas",
    openfinance: "Open Finance",
    "ai-advisor": "Assistente IA",
    settings: "Configuracoes",
    addTransaction: "Adicionar Transacao",
    balance: "Saldo",
    income: "Receitas",
    expenses: "Despesas",
    thisMonth: "Este Mes",
    viewAll: "Ver Todos",
    financialGoals: "Metas Financeiras",
    recentTransactions: "Transacoes Recentes",
    budgetOverview: "Visao Geral de Orcamentos",
    aiTips: "Dicas do Assistente IA",
    quickAdd: "Adicionar Rapido",
    logout: "Sair",
    login: "Entrar com Google",
    welcome: "Bem-vindo ao Finanza AI",
    description: "Seu assistente financeiro inteligente",
    feature1: "IA Avancada",
    feature2: "Controle Total",
    feature3: "Metas Financeiras",
    savingTips: "Dicas de Economia",
    noTransactions: "Nenhuma transacao registrada",
    noGoals: "Nenhuma meta definida",
  },
  en: {
    dashboard: "Dashboard",
    transactions: "Transactions",
    budgets: "Budgets",
    goals: "Goals",
    openfinance: "Open Finance",
    "ai-advisor": "AI Advisor",
    settings: "Settings",
    addTransaction: "Add Transaction",
    balance: "Balance",
    income: "Income",
    expenses: "Expenses",
    thisMonth: "This Month",
    viewAll: "View All",
    financialGoals: "Financial Goals",
    recentTransactions: "Recent Transactions",
    budgetOverview: "Budget Overview",
    aiTips: "AI Advisor Tips",
    quickAdd: "Quick Add",
    logout: "Logout",
    login: "Login with Google",
    welcome: "Welcome to Finanza AI",
    description: "Your intelligent financial assistant",
    feature1: "Advanced AI",
    feature2: "Total Control",
    feature3: "Financial Goals",
    savingTips: "Saving Tips",
    noTransactions: "No transactions recorded",
    noGoals: "No goals defined",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("pt-BR");

  useEffect(() => {
    const saved = localStorage.getItem("finanza_language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("finanza_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};