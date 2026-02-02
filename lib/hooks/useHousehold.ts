// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Household, HouseholdMember } from '@/types';

export function useHousehold(userId: string | undefined) {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [currentHousehold, setCurrentHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadHouseholds();
  }, [userId]);

  const loadHouseholds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all households user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', userId!);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        setHouseholds([]);
        setCurrentHousehold(null);
        setLoading(false);
        return;
      }

      const householdIds = memberData.map((m) => m.household_id);

      const { data: householdsData, error: householdsError } = await supabase
        .from('households')
        .select('*')
        .in('id', householdIds);

      if (householdsError) throw householdsError;

      setHouseholds(householdsData || []);

      // Set first household as current if none selected
      if (householdsData && householdsData.length > 0 && !currentHousehold) {
        setCurrentHousehold(householdsData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load households');
    } finally {
      setLoading(false);
    }
  };

const createHousehold = async (name: string) => {
  if (!userId) return { data: null, error: new Error('Not authenticated') };

  try {
    // Create household - trigger will auto-generate invite_code
    const { data: household, error: householdError } = await supabase
      .from('households')
      .insert({ name })
      .select()
      .single();

    if (householdError) throw householdError;

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('household_members')
      .insert({
        household_id: household.id,
        user_id: userId,
        role: 'owner',
      });

    if (memberError) throw memberError;

    // Reload households
    await loadHouseholds();

    return { data: household, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to create household'),
    };
  }
};

  const joinHousehold = async (inviteCode: string) => {
    if (!userId) return { data: null, error: new Error('Not authenticated') };

    try {
      // Find household by invite code
      const { data: household, error: findError } = await supabase
        .from('households')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (findError) {
        if (findError.code === 'PGRST116') {
          throw new Error('Invalid invite code');
        }
        throw findError;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', household.id)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        throw new Error('Already a member of this household');
      }

      // Add as member
      const { error: joinError } = await supabase
        .from('household_members')
        .insert({
          household_id: household.id,
          user_id: userId,
          role: 'member',
        });

      if (joinError) throw joinError;

      // Reload households
      await loadHouseholds();

      return { data: household, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to join household'),
      };
    }
  };

  const switchHousehold = (household: Household) => {
    setCurrentHousehold(household);
  };

  return {
    households,
    currentHousehold,
    loading,
    error,
    createHousehold,
    joinHousehold,
    switchHousehold,
    refreshHouseholds: loadHouseholds,
  };
}
