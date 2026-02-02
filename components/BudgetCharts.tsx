'use client';

import { CategoryBudget } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface BudgetChartsProps {
  categoryBudgets: CategoryBudget[];
}

export default function BudgetCharts({ categoryBudgets }: BudgetChartsProps) {
  // Vibrant color palette
  const COLORS = ['#9333EA', '#3B82F6', '#EC4899', '#F59E0B'];

  // Prepare data for pie chart (budget allocation)
  const pieData = categoryBudgets.map((cat) => ({
    name: cat.label,
    value: cat.percentage,
  }));

  // Prepare data for bar chart (spending vs budget)
  const barData = categoryBudgets.map((cat) => ({
    name: cat.label,
    Budget: cat.allocated,
    Spent: cat.spent,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Pie Chart - Budget Allocation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base lg:text-lg text-primary">Budget Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000',
                  border: '1px solid #9333EA',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Spending vs Budget */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base lg:text-lg text-accent">Spending vs Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis
                dataKey="name"
                stroke="#9333EA"
                tick={{ fill: '#9333EA' }}
              />
              <YAxis
                stroke="#9333EA"
                tick={{ fill: '#9333EA' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000',
                  border: '1px solid #9333EA',
                  color: '#fff'
                }}
              />
              <Legend
                wrapperStyle={{ color: '#fff' }}
              />
              <Bar dataKey="Budget" fill="#9333EA" />
              <Bar dataKey="Spent" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
