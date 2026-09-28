export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      group_plans: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          id: string
          invite_code: string
          member_ids: string[]
          target_amount: number
          title: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string
          id?: string
          invite_code: string
          member_ids: string[]
          target_amount: number
          title: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          invite_code?: string
          member_ids?: string[]
          target_amount?: number
          title?: string
        }
        Relationships: []
      }
      private_goals: {
        Row: {
          cadence: "daily" | "weekly" | "monthly" | null
          created_at: string
          id: string
          name: string
          planned_amount: number | null
          start_date: string | null
          target_amount: number
          user_id: string
        }
        Insert: {
          cadence?: "daily" | "weekly" | "monthly" | null
          created_at?: string
          id?: string
          name: string
          planned_amount?: number | null
          start_date?: string | null
          target_amount: number
          user_id: string
        }
        Update: {
          cadence?: "daily" | "weekly" | "monthly" | null
          created_at?: string
          id?: string
          name?: string
          planned_amount?: number | null
          start_date?: string | null
          target_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      savings_records: {
        Row: {
          amount: number
          created_at: string
          id: string
          note: string | null
          plan_id: string | null
          private_goal_id: string | null
          recorded_on: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          plan_id?: string | null
          private_goal_id?: string | null
          recorded_on?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          plan_id?: string | null
          private_goal_id?: string | null
          recorded_on?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      join_plan: { Args: { invite: string }; Returns: string }
      leave_plan: { Args: { plan: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Cadence = "daily" | "weekly" | "monthly"
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type PrivateGoal = Database["public"]["Tables"]["private_goals"]["Row"]
export type GroupPlan = Database["public"]["Tables"]["group_plans"]["Row"]
export type SavingsRecord = Database["public"]["Tables"]["savings_records"]["Row"]
