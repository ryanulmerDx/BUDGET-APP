// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Expense } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useExpenses(householdId: string | undefined, month: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      return;
    }

    loadExpenses();

    // Set up realtime subscription
    const channel: RealtimeChannel = supabase
      .channel(`expenses:household_id=eq.${householdId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `household_id=eq.${householdId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newExpense = payload.new as Expense;
            // Only add if it's for the current month
            if (newExpense.date.startsWith(month)) {
              setExpenses((prev) => [newExpense, ...prev]);
            }
          } else if (payload.eventType === 'DELETE') {
            setExpenses((prev) => prev.filter((e) => e.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedExpense = payload.new as Expense;
            setExpenses((prev) =>
              prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [householdId, month]);

  const loadExpenses = async () => {
    if (!householdId) return;

    try {
      setLoading(true);
      setError(null);

      // Get expenses for the current month
      const startDate = `${month}-01`;
      const endDate = `${month}-31`; // Covers all months

      const { data, error: fetchError } = await supabase
        .from('expenses')
        .select(`
          *,
          profile:profiles!expenses_created_by_fkey(
            id,
            email,
            full_name
          )
        `)
        .eq('household_id', householdId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;

      setExpenses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (
    category: 'needs' | 'ryan_spend' | 'seneca_spend' | 'savings',
    description: string,
    amount: number,
    date: string,
    userId: string
  ) => {
    if (!householdId) return { data: null, error: new Error('No household selected') };

    try {
      const expenseData = {
        household_id: householdId,
        category,
        description,
        amount,
        date,
        created_by: userId,
      };

      console.log('Adding expense with data:', expenseData);

      const { data, error: insertError } = await supabase
        .from('expenses')
        .insert(expenseData)
        .select(`
          *,
          profile:profiles!expenses_created_by_fkey(
            id,
            email,
            full_name
          )
        `)
        .single();

      console.log('Insert result:', { data, error: insertError });

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw insertError;
      }

      // Realtime will handle adding to state
      return { data, error: null };
    } catch (err) {
      console.error('Add expense error:', err);
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to add expense'),
      };
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      console.log('Deleting expense:', expenseId);

      const { error: deleteError } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      console.log('Delete result:', { error: deleteError });

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw deleteError;
      }

      // Immediately update local state (optimistic update)
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));

      return { error: null };
    } catch (err) {
      console.error('Delete expense error:', err);
      return {
        error: err instanceof Error ? err : new Error('Failed to delete expense'),
      };
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    deleteExpense,
    refreshExpenses: loadExpenses,
  };
}
