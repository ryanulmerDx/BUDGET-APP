'use client';

import { CategoryBudget } from '@/types';
import CategoryCard from './CategoryCard';

interface BudgetOverviewProps {
  categoryBudgets: CategoryBudget[];
}

export default function BudgetOverview({ categoryBudgets }: BudgetOverviewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-purple-300 mb-4">
        Budget Overview
      </h2>
      <p className="text-blue-300 mb-6">
        Your budget is divided: 50% Needs, 10% Ryan Spend, 10% Seneca Spend, and 30% Savings
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryBudgets.map((categoryBudget) => (
          <CategoryCard
            key={categoryBudget.category}
            categoryBudget={categoryBudget}
          />
        ))}
      </div>
    </div>
  );
}
