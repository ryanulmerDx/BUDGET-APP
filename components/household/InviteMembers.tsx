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
    <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/40">
      <CardHeader>
        <CardTitle className="text-cyan-300">Invite Members</CardTitle>
        <CardDescription className="text-blue-200">
          Share this code with family members to invite them to your household
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-widest bg-cyan-500/20 text-cyan-100 py-4 sm:py-6 rounded-lg border border-cyan-500/30">
              {inviteCode}
            </div>
          </div>
          <Button onClick={handleCopy} className="bg-cyan-600 hover:bg-cyan-500 text-white w-full sm:w-auto">
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
