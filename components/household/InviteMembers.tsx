'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InviteMembersProps {
  inviteCode: string;
}

export default function InviteMembers({ inviteCode }: InviteMembersProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
        <CardDescription>
          Share this code with family members to invite them to your household
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center">
            <div className="text-3xl font-bold tracking-widest bg-gray-100 py-4 rounded-lg">
              {inviteCode}
            </div>
          </div>
          <Button onClick={handleCopy} variant="outline">
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
