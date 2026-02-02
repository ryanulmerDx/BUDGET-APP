'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/calculations';

interface IncomeSetupProps {
  currentIncome: number;
  onIncomeUpdate: (income: number) => Promise<void>;
  loading?: boolean;
}

export default function IncomeSetup({ currentIncome, onIncomeUpdate, loading }: IncomeSetupProps) {
  const [isEditing, setIsEditing] = useState(currentIncome === 0);
  const [incomeInput, setIncomeInput] = useState(currentIncome.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsedIncome = parseFloat(incomeInput);

    if (isNaN(parsedIncome) || parsedIncome < 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setSaving(true);
    await onIncomeUpdate(parsedIncome);
    setSaving(false);
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
    <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/40">
      <CardHeader>
        <CardTitle className="text-green-300">Monthly Income</CardTitle>
        <CardDescription className="text-emerald-200">
          Set your monthly income to calculate your 50/20/30 budget
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
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              {currentIncome > 0 && (
                <Button variant="outline" onClick={handleCancel} disabled={saving || loading}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-300">Current Monthly Income</p>
              <p className="text-3xl font-bold text-green-200">
                {formatCurrency(currentIncome)}
              </p>
            </div>
            <Button variant="outline" onClick={handleEdit} disabled={loading} className="border-green-500 text-green-300 hover:bg-green-500/20">
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
