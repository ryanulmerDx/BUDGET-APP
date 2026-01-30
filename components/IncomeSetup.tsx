'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/calculations';

interface IncomeSetupProps {
  currentIncome: number;
  onIncomeUpdate: (income: number) => void;
}

export default function IncomeSetup({ currentIncome, onIncomeUpdate }: IncomeSetupProps) {
  const [isEditing, setIsEditing] = useState(currentIncome === 0);
  const [incomeInput, setIncomeInput] = useState(currentIncome.toString());

  const handleSave = () => {
    const parsedIncome = parseFloat(incomeInput);

    if (isNaN(parsedIncome) || parsedIncome < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    onIncomeUpdate(parsedIncome);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIncomeInput(currentIncome.toString());
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIncomeInput(currentIncome.toString());
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
        <CardDescription>
          Set your monthly income to calculate your 50/30/20 budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="income">Monthly Income ($)</Label>
              <Input
                id="income"
                type="number"
                min="0"
                step="0.01"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                placeholder="Enter your monthly income"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              {currentIncome > 0 && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Monthly Income</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(currentIncome)}
              </p>
            </div>
            <Button variant="outline" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
