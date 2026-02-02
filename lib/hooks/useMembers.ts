'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HouseholdMember } from '@/types';

export function useMembers(householdId: string | undefined) {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      return;
    }

    loadMembers();
  }, [householdId]);

  const loadMembers = async () => {
    if (!householdId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('household_members')
        .select(`
          *,
          profile:profiles!household_members_user_id_fkey(
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('household_id', householdId)
        .order('joined_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('household_members')
        .delete()
        .eq('id', memberId);

      if (deleteError) throw deleteError;

      await loadMembers();
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to remove member'),
      };
    }
  };

  return {
    members,
    loading,
    error,
    removeMember,
    refreshMembers: loadMembers,
  };
}
