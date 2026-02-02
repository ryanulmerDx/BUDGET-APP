'use client';

import type { Household } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HouseholdSelectorProps {
  households: Household[];
  currentHousehold: Household | null;
  onSelectHousehold: (household: Household) => void;
}

export default function HouseholdSelector({
  households,
  currentHousehold,
  onSelectHousehold,
}: HouseholdSelectorProps) {
  if (households.length === 0) return null;

  return (
    <Select
      value={currentHousehold?.id}
      onValueChange={(value) => {
        const household = households.find((h) => h.id === value);
        if (household) onSelectHousehold(household);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select household" />
      </SelectTrigger>
      <SelectContent>
        {households.map((household) => (
          <SelectItem key={household.id} value={household.id}>
            {household.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
