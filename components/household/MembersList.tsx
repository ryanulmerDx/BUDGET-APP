'use client';

import type { HouseholdMember } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MembersListProps {
  members: HouseholdMember[];
  currentUserId: string;
  onRemoveMember: (memberId: string) => Promise<void>;
}

export default function MembersList({ members, currentUserId, onRemoveMember }: MembersListProps) {
  const currentMember = members.find((m) => m.user_id === currentUserId);
  const canManageMembers = currentMember?.role === 'owner' || currentMember?.role === 'admin';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Household Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {member.profile?.full_name || member.profile?.email}
                  {member.user_id === currentUserId && (
                    <span className="ml-2 text-sm text-gray-500">(You)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {member.profile?.email} • {member.role}
                </p>
              </div>
              {canManageMembers && member.user_id !== currentUserId && member.role !== 'owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
