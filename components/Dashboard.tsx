'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useHousehold } from '@/lib/hooks/useHousehold';
import { useBudget } from '@/lib/hooks/useBudget';
import { useExpenses } from '@/lib/hooks/useExpenses';
import { calculateCategoryBudgets } from '@/lib/calculations';
import { getCurrentMonth } from '@/lib/storage';
import IncomeSetup from './IncomeSetup';
import BudgetOverview from './BudgetOverview';
import BudgetCharts from './BudgetCharts';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import UserMenu from './auth/UserMenu';
import HouseholdSelector from './household/HouseholdSelector';
import CreateHousehold from './household/CreateHousehold';
import JoinHousehold from './household/JoinHousehold';
import InviteMembers from './household/InviteMembers';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const {
    households,
    currentHousehold,
    loading: householdLoading,
    createHousehold,
    joinHousehold,
    switchHousehold,
  } = useHousehold(user?.id);

  const currentMonth = getCurrentMonth();
  const { budget, updateIncome, loading: budgetLoading } = useBudget(
    currentHousehold?.id,
    currentMonth
  );
  const { expenses, addExpense, deleteExpense, loading: expensesLoading } = useExpenses(
    currentHousehold?.id,
    currentMonth
  );

  if (authLoading || householdLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-foreground">Loading...</div>
      </div>
    );
  }

  // Show household selection/creation if user has no households
  if (!currentHousehold) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Budget Tracker</h1>
              <p className="text-muted-foreground">Get started by creating or joining a household</p>
            </div>
            <UserMenu />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreateHousehold
              onCreateHousehold={async (name) => {
                const result = await createHousehold(name);
                if (result.error) throw result.error;
              }}
            />
            <JoinHousehold
              onJoinHousehold={async (code) => {
                const result = await joinHousehold(code);
                if (result.error) throw result.error;
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const categoryBudgets = calculateCategoryBudgets(
    budget?.income || 0,
    expenses,
    currentMonth
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Budget Tracker</h1>
            <p className="text-muted-foreground">Managing your finances with the 50/20/30 rule</p>
            <p className="text-sm text-muted-foreground mt-1">
              Current Month:{' '}
              {new Date(currentMonth + '-01').toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <HouseholdSelector
              households={households}
              currentHousehold={currentHousehold}
              onSelectHousehold={switchHousehold}
            />
            <UserMenu />
          </div>
        </div>

        {/* Income Setup */}
        <div className="mb-8">
          <IncomeSetup
            currentIncome={budget?.income || 0}
            onIncomeUpdate={async (newIncome) => {
              const result = await updateIncome(newIncome);
              if (result.error) {
                alert('Failed to update income: ' + result.error.message);
              }
            }}
            loading={budgetLoading}
          />
        </div>

        {/* Household Invite Code */}
        {currentHousehold?.invite_code && (
          <div className="mb-8">
            <InviteMembers inviteCode={currentHousehold.invite_code} />
          </div>
        )}

        {/* Show budget overview only if income is set */}
        {budget && budget.income > 0 && (
          <>
            {/* Budget Overview */}
            <div className="mb-8">
              <BudgetOverview categoryBudgets={categoryBudgets} />
            </div>

            {/* Budget Charts */}
            <BudgetCharts categoryBudgets={categoryBudgets} />

            {/* Expense Form */}
            <div className="mb-8">
              <ExpenseForm
                onAddExpense={async (expense) => {
                  if (!user) return;
                  const result = await addExpense(
                    expense.category,
                    expense.description,
                    expense.amount,
                    expense.date,
                    user.id
                  );
                  if (result.error) {
                    alert('Failed to add expense: ' + result.error.message);
                  }
                }}
              />
            </div>

            {/* Expense List */}
            <div>
              <ExpenseList
                expenses={expenses}
                onDeleteExpense={async (expenseId) => {
                  const result = await deleteExpense(expenseId);
                  if (result.error) {
                    alert('Failed to delete expense: ' + result.error.message);
                  }
                }}
                loading={expensesLoading}
              />
            </div>
          </>
        )}

        {/* Empty state when no income is set */}
        {budget && budget.income === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Set your monthly income above to get started with budgeting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
