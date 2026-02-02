'use client';

import { CategoryBudget } from '@/types';
import CategoryCard from './CategoryCard';

interface BudgetOverviewProps {
  categoryBudgets: CategoryBudget[];
}

export default function BudgetOverview({ categoryBudgets }: BudgetOverviewProps) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-3 sm:mb-4">
        Budget Overview
      </h2>
      <p className="text-sm sm:text-base text-blue-300 mb-4 sm:mb-6">
        Your budget is divided: 50% Needs, 10% Ryan Spend, 10% Seneca Spend, and 30% Savings
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
