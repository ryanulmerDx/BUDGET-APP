// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Budget } from '@/types';
import type { Database } from '@/types/database';

export function useBudget(householdId: string | undefined, month: string) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      return;
    }

    loadBudget();
  }, [householdId, month]);

  const loadBudget = async () => {
    if (!householdId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('budgets')
        .select('*')
        .eq('household_id', householdId)
        .eq('month', month)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No budget exists for this month, create default
          const insertData = {
            household_id: householdId,
            month: month,
            income: 0,
          };

          const result = await supabase
            .from('budgets')
            .insert(insertData)
            .select()
            .single();

          if (result.error) throw result.error;
          setBudget(result.data as Budget);
        } else {
          throw fetchError;
        }
      } else {
        setBudget(data as Budget);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budget');
    } finally {
      setLoading(false);
    }
  };

  const updateIncome = async (income: number) => {
  if (!householdId) return { error: new Error('No household selected') };

  try {
    console.log('Updating income for household:', householdId, 'month:', month, 'income:', income);

    // First, check if a budget already exists
    const { data: existingBudget, error: fetchError } = await supabase
      .from('budgets')
      .select('*')
      .eq('household_id', householdId)
      .eq('month', month)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing budget:', fetchError);
      throw fetchError;
    }

    let result;
    if (existingBudget) {
      // Update existing budget
      console.log('Updating existing budget:', existingBudget.id);
      result = await supabase
        .from('budgets')
        .update({ income })
        .eq('id', existingBudget.id)
        .select()
        .single();
    } else {
      // Insert new budget
      console.log('Inserting new budget');
      result = await supabase
        .from('budgets')
        .insert({
          household_id: householdId,
          month: month,
          income: income,
        })
        .select()
        .single();
    }

    console.log('Result:', result);

    if (result.error) {
      console.error('Supabase error:', result.error);
      throw result.error;
    }

    setBudget(result.data as Budget);
    return { data: result.data as Budget, error: null };
  } catch (err) {
    console.error('Update income error:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to update income: ' + String(err)),
    };
  }
};

  return {
    budget,
    loading,
    error,
    updateIncome,
    refreshBudget: loadBudget,
  };
}
