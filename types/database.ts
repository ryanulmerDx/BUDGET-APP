export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      households: {
        Row: {
          id: string
          name: string
          created_by: string
          invite_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          invite_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          invite_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      household_members: {
        Row: {
          id: string
          household_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          household_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          household_id: string
          month: string
          income: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          month: string
          income?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          month?: string
          income?: number
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          household_id: string
          category: 'needs' | 'ryan_spend' | 'seneca_spend' | 'savings'
          description: string
          amount: number
          date: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          category: 'needs' | 'ryan_spend' | 'seneca_spend' | 'savings'
          description: string
          amount: number
          date: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          category?: 'needs' | 'ryan_spend' | 'seneca_spend' | 'savings'
          description?: string
          amount?: number
          date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
