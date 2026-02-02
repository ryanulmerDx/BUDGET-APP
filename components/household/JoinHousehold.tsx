'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface JoinHouseholdProps {
  onJoinHousehold: (inviteCode: string) => Promise<void>;
}

export default function JoinHousehold({ onJoinHousehold }: JoinHouseholdProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onJoinHousehold(inviteCode);
      setInviteCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join household');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-pink-600 via-rose-600 to-orange-600 border-0 shadow-2xl shadow-pink-500/50">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Join a Household</CardTitle>
        <CardDescription className="text-pink-100">
          Have an invite code? Enter it below to join an existing household.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode" className="text-white font-semibold">Invite Code</Label>
            <Input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              required
              className="uppercase bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
          </div>

          {error && (
            <div className="text-sm text-white bg-red-500/30 border border-red-400/50 p-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-white text-pink-600 hover:bg-pink-50 font-bold">
            {loading ? 'Joining...' : 'Join Household'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
