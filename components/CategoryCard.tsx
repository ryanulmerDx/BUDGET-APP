'use client';

import { CategoryBudget } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, getSpendingPercentage, getProgressColor } from '@/lib/calculations';

interface CategoryCardProps {
  categoryBudget: CategoryBudget;
}

const categoryIcons: Record<string, string> = {
  needs: '🏠',
  wants: '🎉',
  savings: '💰',
};

const categoryDescriptions: Record<string, string> = {
  needs: 'Rent, utilities, groceries, insurance',
  wants: 'Dining out, entertainment, hobbies',
  savings: 'Emergency fund, investments, debt payoff',
};

export default function CategoryCard({ categoryBudget }: CategoryCardProps) {
  const { category, label, percentage, allocated, spent, remaining } = categoryBudget;
  const spendingPercentage = getSpendingPercentage(spent, allocated);
  const progressColorClass = getProgressColor(spendingPercentage);

  const isOverBudget = remaining < 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[category]}</span>
          <div>
            <div className="text-xl font-bold">{label}</div>
            <div className="text-sm font-normal text-gray-500">
              {percentage}% of income
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600">
          {categoryDescriptions[category]}
        </p>

        {/* Budget amounts */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Allocated:</span>
            <span className="font-semibold">{formatCurrency(allocated)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Spent:</span>
            <span className="font-semibold">{formatCurrency(spent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{spendingPercentage.toFixed(1)}%</span>
          </div>
          <div className="relative">
            <Progress
              value={spendingPercentage}
              className="h-3"
            />
            <div
              className={`absolute inset-0 h-3 rounded-full ${progressColorClass} transition-all`}
              style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
            />
          </div>
          {isOverBudget && (
            <p className="text-xs text-red-600 font-medium">
              Over budget by {formatCurrency(Math.abs(remaining))}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
