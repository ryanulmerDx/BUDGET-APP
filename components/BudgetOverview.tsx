'use client';

import { CategoryBudget } from '@/types';
import CategoryCard from './CategoryCard';

interface BudgetOverviewProps {
  categoryBudgets: CategoryBudget[];
}

export default function BudgetOverview({ categoryBudgets }: BudgetOverviewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Budget Overview
      </h2>
      <p className="text-gray-600 mb-6">
        Your budget is divided using the 50/30/20 rule: 50% for Needs, 30% for Wants, and 20% for Savings
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
