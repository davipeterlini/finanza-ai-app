// App constants
export const APP_NAME = "Finanza AI";
export const APP_VERSION = "0.1.0";

// Storage keys
export const STORAGE_KEYS = {
  TRANSACTIONS: "finanza_transactions",
  BUDGETS: "finanza_budgets",
  GOALS: "finanza_goals",
  BANK_CONNECTIONS: "finanza_bank_connections",
  USER_SETTINGS: "finanza_user_settings",
} as const;

// Default values
export const DEFAULTS = {
  CURRENCY: "BRL",
  LANGUAGE: "pt-BR",
  THEME: "dark",
} as const;

// AI Advisor cache duration (5 minutes)
export const AI_ADVICE_CACHE_DURATION = 5 * 60 * 1000;