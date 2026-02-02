export type CategoryType = 'needs' | 'ryan_spend' | 'seneca_spend' | 'savings';
export type UserRole = 'owner' | 'admin' | 'member';

// Supabase database types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Household {
  id: string;
  name: string;
  created_by: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
  profile?: Profile;
}

export interface Budget {
  id: string;
  household_id: string;
  month: string;
  income: number;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  household_id: string;
  category: CategoryType;
  description: string;
  amount: number;
  date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  profile?: Profile; // Joined profile data
}

// UI-specific types
export interface CategoryBudget {
  category: CategoryType;
  label: string;
  percentage: number;
  allocated: number;
  spent: number;
  remaining: number;
}
