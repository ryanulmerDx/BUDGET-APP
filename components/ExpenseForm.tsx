'use client';

import { useState } from 'react';
import { CategoryType, Expense } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExpenseFormProps {
  onAddExpense: (expense: { category: CategoryType; description: string; amount: number; date: string }) => Promise<void>;
}

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [category, setCategory] = useState<CategoryType>('needs');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    if (!date) {
      alert('Please select a date');
      return;
    }

    setAdding(true);
    await onAddExpense({
      category,
      description: description.trim(),
      amount: parsedAmount,
      date,
    });
    setAdding(false);

    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    // Keep category selected for convenience
  };

  return (
    <Card className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border-orange-500/40">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg sm:text-xl text-orange-300">Add Expense</CardTitle>
        <CardDescription className="text-sm sm:text-base text-amber-200">
          Track your spending by adding expenses to each category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as CategoryType)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="needs">🏠 Needs</SelectItem>
                  <SelectItem value="ryan_spend">👤 Ryan Spend</SelectItem>
                  <SelectItem value="seneca_spend">👥 Seneca Spend</SelectItem>
                  <SelectItem value="savings">💰 Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Groceries, Movie tickets"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={adding}>
            {adding ? 'Adding...' : 'Add Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
