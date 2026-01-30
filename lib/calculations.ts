import { CategoryType, CategoryBudget, Expense } from '@/types';

export function calculateBudgetSplit(income: number) {
  return {
    needs: income * 0.5,      // 50%
    wants: income * 0.3,      // 30%
    savings: income * 0.2,    // 20%
  };
}

export function calculateCategoryTotals(
  expenses: Expense[],
  currentMonth: string
): Record<CategoryType, number> {
  const totals: Record<CategoryType, number> = {
    needs: 0,
    wants: 0,
    savings: 0,
  };

  expenses.forEach((expense) => {
    // Only include expenses from the current month
    const expenseMonth = expense.date.substring(0, 7); // Extract YYYY-MM
    if (expenseMonth === currentMonth) {
      totals[expense.category] += expense.amount;
    }
  });

  return totals;
}

export function calculateCategoryBudgets(
  income: number,
  expenses: Expense[],
  currentMonth: string
): CategoryBudget[] {
  const split = calculateBudgetSplit(income);
  const totals = calculateCategoryTotals(expenses, currentMonth);

  const categories: CategoryBudget[] = [
    {
      category: 'needs',
      label: 'Needs',
      percentage: 50,
      allocated: split.needs,
      spent: totals.needs,
      remaining: split.needs - totals.needs,
    },
    {
      category: 'wants',
      label: 'Wants',
      percentage: 30,
      allocated: split.wants,
      spent: totals.wants,
      remaining: split.wants - totals.wants,
    },
    {
      category: 'savings',
      label: 'Savings',
      percentage: 20,
      allocated: split.savings,
      spent: totals.savings,
      remaining: split.savings - totals.savings,
    },
  ];

  return categories;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getSpendingPercentage(spent: number, allocated: number): number {
  if (allocated === 0) return 0;
  return Math.min((spent / allocated) * 100, 100);
}

export function getProgressColor(percentage: number): string {
  if (percentage < 75) return 'bg-green-500';
  if (percentage < 90) return 'bg-yellow-500';
  return 'bg-red-500';
}
