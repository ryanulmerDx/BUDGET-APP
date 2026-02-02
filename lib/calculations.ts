import { CategoryType, CategoryBudget, Expense } from '@/types';

export function calculateBudgetSplit(income: number) {
  return {
    needs: income * 0.5,           // 50%
    ryan_spend: income * 0.1,      // 10%
    seneca_spend: income * 0.1,    // 10%
    savings: income * 0.3,         // 30%
  };
}

export function calculateCategoryTotals(
  expenses: Expense[],
  currentMonth: string
): Record<CategoryType, number> {
  const totals: Record<CategoryType, number> = {
    needs: 0,
    ryan_spend: 0,
    seneca_spend: 0,
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
      category: 'ryan_spend',
      label: 'Ryan Spend',
      percentage: 10,
      allocated: split.ryan_spend,
      spent: totals.ryan_spend,
      remaining: split.ryan_spend - totals.ryan_spend,
    },
    {
      category: 'seneca_spend',
      label: 'Seneca Spend',
      percentage: 10,
      allocated: split.seneca_spend,
      spent: totals.seneca_spend,
      remaining: split.seneca_spend - totals.seneca_spend,
    },
    {
      category: 'savings',
      label: 'Savings',
      percentage: 30,
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
  // Vibrant theme - colors change based on usage
  if (percentage < 75) return 'bg-blue-500'; // Blue for good
  if (percentage < 90) return 'bg-purple-500'; // Purple for warning
  return 'bg-pink-500'; // Pink for high usage
}
