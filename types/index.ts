export type CategoryType = 'needs' | 'wants' | 'savings';

export interface BudgetData {
  monthlyIncome: number;
  currentMonth: string; // Format: "2026-01"
}

export interface Expense {
  id: string;
  category: CategoryType;
  description: string;
  amount: number;
  date: string; // ISO date string
  timestamp: number;
}

export interface CategoryBudget {
  category: CategoryType;
  label: string;
  percentage: number;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface AppState {
  budget: BudgetData;
  expenses: Expense[];
}
