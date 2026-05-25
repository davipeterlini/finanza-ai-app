import { Transaction, Budget, Goal, BankConnection } from "../types";
import { STORAGE_KEYS } from "../constants";

const PREFIX = "finanza_";

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage write failed:", e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  // Transaction helpers
  getTransactions(): Transaction[] {
    return this.get<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  },

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  },

  // Budget helpers
  getBudgets(): Budget[] {
    return this.get<Budget[]>(STORAGE_KEYS.BUDGETS, []);
  },

  setBudgets(budgets: Budget[]): void {
    this.set(STORAGE_KEYS.BUDGETS, budgets);
  },

  // Goal helpers
  getGoals(): Goal[] {
    return this.get<Goal[]>(STORAGE_KEYS.GOALS, []);
  },

  setGoals(goals: Goal[]): void {
    this.set(STORAGE_KEYS.GOALS, goals);
  },

  // Bank connection helpers
  getBankConnections(): BankConnection[] {
    return this.get<BankConnection[]>(STORAGE_KEYS.BANK_CONNECTIONS, []);
  },

  setBankConnections(connections: BankConnection[]): void {
    this.set(STORAGE_KEYS.BANK_CONNECTIONS, connections);
  },
};