'use client';

import { Expense, CategoryType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/calculations';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => Promise<void>;
  loading?: boolean;
}

const categoryLabels: Record<CategoryType, string> = {
  needs: '🏠 Needs',
  ryan_spend: '👤 Ryan Spend',
  seneca_spend: '👥 Seneca Spend',
  savings: '💰 Savings',
};

export default function ExpenseList({ expenses, onDeleteExpense, loading }: ExpenseListProps) {
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Group expenses by category
  const groupedExpenses = sortedExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<CategoryType, Expense[]>);

  // Calculate totals per category
  const categoryTotals = Object.entries(groupedExpenses).reduce((acc, [category, items]) => {
    acc[category as CategoryType] = items.reduce((sum, item) => sum + item.amount, 0);
    return acc;
  }, {} as Record<CategoryType, number>);

  const categories: CategoryType[] = ['needs', 'ryan_spend', 'seneca_spend', 'savings'];

  if (expenses.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-purple-300">
            <p className="text-lg">No expenses yet</p>
            <p className="text-sm mt-2">Add your first expense above to start tracking</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-purple-300">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryExpenses = groupedExpenses[category];
            if (!categoryExpenses || categoryExpenses.length === 0) {
              return null;
            }

            return (
              <div key={category}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-blue-300">
                    {categoryLabels[category]}
                  </h3>
                  <span className="text-sm font-medium text-cyan-300">
                    Total: {formatCurrency(categoryTotals[category])}
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-white">
                              {expense.description}
                            </p>
                            <p className="text-sm text-purple-200">
                              {new Date(expense.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                              {expense.profile && expense.profile.full_name && (
                                <span> • {expense.profile.full_name}</span>
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-cyan-300">
                              {formatCurrency(expense.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          console.log('Delete clicked for expense:', expense.id);
                          onDeleteExpense(expense.id);
                        }}
                        className="ml-3"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
