'use client';

import { useState, useEffect } from 'react';
import { AppState, Expense } from '@/types';
import { loadAppState, saveAppState, getCurrentMonth } from '@/lib/storage';
import { calculateCategoryBudgets } from '@/lib/calculations';
import IncomeSetup from './IncomeSetup';
import BudgetOverview from './BudgetOverview';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedState = loadAppState();
    setAppState(loadedState);
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (appState && !isLoading) {
      saveAppState(appState);
    }
  }, [appState, isLoading]);

  const handleIncomeUpdate = (newIncome: number) => {
    if (!appState) return;

    setAppState({
      ...appState,
      budget: {
        ...appState.budget,
        monthlyIncome: newIncome,
      },
    });
  };

  const handleAddExpense = (expense: Expense) => {
    if (!appState) return;

    setAppState({
      ...appState,
      expenses: [...appState.expenses, expense],
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!appState) return;

    setAppState({
      ...appState,
      expenses: appState.expenses.filter((e) => e.id !== expenseId),
    });
  };

  if (isLoading || !appState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const { budget, expenses } = appState;
  const currentMonth = getCurrentMonth();
  const categoryBudgets = calculateCategoryBudgets(
    budget.monthlyIncome,
    expenses,
    currentMonth
  );

  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(
    (expense) => expense.date.substring(0, 7) === currentMonth
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Budget Tracker
          </h1>
          <p className="text-gray-600">
            Managing your finances with the 50/30/20 rule
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Current Month: {new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Income Setup */}
        <div className="mb-8">
          <IncomeSetup
            currentIncome={budget.monthlyIncome}
            onIncomeUpdate={handleIncomeUpdate}
          />
        </div>

        {/* Show budget overview only if income is set */}
        {budget.monthlyIncome > 0 && (
          <>
            {/* Budget Overview */}
            <div className="mb-8">
              <BudgetOverview categoryBudgets={categoryBudgets} />
            </div>

            {/* Expense Form */}
            <div className="mb-8">
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>

            {/* Expense List */}
            <div>
              <ExpenseList
                expenses={currentMonthExpenses}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </>
        )}

        {/* Empty state when no income is set */}
        {budget.monthlyIncome === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Set your monthly income above to get started with budgeting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
