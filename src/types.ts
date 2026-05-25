// Transaction types
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  bankConnectionId?: string;
}

// Budget types
export interface Budget {
  id: string;
  category: string;
  month: string;
  limit: number;
  spent: number;
}

// Goal types
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

// Bank connection types
export interface Account {
  id: string;
  type: "checking" | "savings" | "investment";
  name: string;
  balance: number;
  currency: string;
}

export interface Card {
  id: string;
  name: string;
  lastDigits: string;
  balance: number;
  creditLimit: number;
}

export interface BankConnection {
  id: string;
  bankId: string;
  bankName: string;
  connectedAt: Date;
  accounts: Account[];
  cards: Card[];
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accessToken?: string;
}

// App state types
export type View =
  | "dashboard"
  | "transactions"
  | "budgets"
  | "goals"
  | "openfinance"
  | "ai-advisor"
  | "settings";

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Category mapping for auto-categorization
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Alimentacao": ["mercado", "supermercado", "ifood", "rappi", "restaurant", "lanchonete"],
  "Transporte": ["uber", "99", "滴滴", "gasolina", "combustivel", "metro", "onibus"],
  "Lazer": ["netflix", "spotify", "steam", "playstation", "cinema", "teatro"],
  "Moradia": ["aluguel", "condominio", "luz", "agua", "internet"],
  "Saude": ["farmacia", "drogaria", "consulta", "medico", "hospital"],
  "Educação": ["curso", "livro", "escola", "faculdade", "material"],
  "Vestuario": ["roupa", "sapato", "Zara", "H&M", "renner", "c&A"],
  "Servicos": ["assinatura", "servico", "Netflix", "Amazon"],
};

// Categories list
export const CATEGORIES = [
  "Alimentacao",
  "Transporte",
  "Lazer",
  "Moradia",
  "Saude",
  "Educacao",
  "Vestuario",
  "Servicos",
  "Outros",
] as const;

export type Category = (typeof CATEGORIES)[number];