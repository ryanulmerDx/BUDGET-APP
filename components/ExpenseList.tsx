'use client';

import { Expense, CategoryType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/calculations';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => void;
}

const categoryLabels: Record<CategoryType, string> = {
  needs: '🏠 Needs',
  wants: '🎉 Wants',
  savings: '💰 Savings',
};

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
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

  const categories: CategoryType[] = ['needs', 'wants', 'savings'];

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No expenses yet</p>
            <p className="text-sm mt-2">Add your first expense above to start tracking</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {categoryLabels[category]}
                  </h3>
                  <span className="text-sm font-medium text-gray-600">
                    Total: {formatCurrency(categoryTotals[category])}
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {expense.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(expense.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(expense.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteExpense(expense.id)}
                        className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
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
