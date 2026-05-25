import { useMemo } from "react";
import { Transaction, Budget, Goal } from "../types";
import { storage } from "../services/storage";

interface UseDashboardDataReturn {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  recentTransactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  getBalanceByCategory: () => Record<string, number>;
  getMonthlyTotals: () => { income: number; expenses: number };
}

export function useDashboardData(): UseDashboardDataReturn {
  const transactions = storage.getTransactions();
  const budgets = storage.getBudgets();
  const goals = storage.getGoals();

  const getMonthlyTotals = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    const monthlyTx = transactions.filter((tx) => tx.date.startsWith(currentMonth));

    const income = monthlyTx
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = monthlyTx
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { income, expenses };
  }, [transactions]);

  const totalBalance = useMemo(() => {
    return transactions.reduce((sum, tx) => {
      return tx.type === "income" ? sum + tx.amount : sum - tx.amount;
    }, 0);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const getBalanceByCategory = (): Record<string, number> => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    const monthlyTx = transactions.filter(
      (tx) => tx.date.startsWith(currentMonth) && tx.type === "expense"
    );

    const byCategory: Record<string, number> = {};
    monthlyTx.forEach((tx) => {
      byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
    });

    return byCategory;
  };

  return {
    totalBalance,
    monthlyIncome: getMonthlyTotals.income,
    monthlyExpenses: getMonthlyTotals.expenses,
    recentTransactions,
    budgets,
    goals,
    getBalanceByCategory,
    getMonthlyTotals,
  };
}