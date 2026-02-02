'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateHouseholdProps {
  onCreateHousehold: (name: string) => Promise<void>;
}

export default function CreateHousehold({ onCreateHousehold }: CreateHouseholdProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onCreateHousehold(name);
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create household');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 border-0 shadow-2xl shadow-blue-500/50">
      <CardHeader className="space-y-2">
        <CardTitle className="text-white text-xl sm:text-2xl">Create Your Household</CardTitle>
        <CardDescription className="text-blue-100 text-sm sm:text-base">
          Start tracking your budget by creating a household. You can invite others to join later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="householdName" className="text-white font-semibold">Household Name</Label>
            <Input
              id="householdName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Smith Family, Our Home"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-white bg-red-500/30 border border-red-400/50 p-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold">
            {loading ? 'Creating...' : 'Create Household'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
