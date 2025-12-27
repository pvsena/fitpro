export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          gender: 'masculino' | 'feminino' | 'outro'
          age: number
          weight: number
          height: number
          goal: 'hipertrofia' | 'emagrecimento' | 'fortalecimento'
          experience_level: 'iniciante' | 'intermediario' | 'avancado'
          training_days_per_week: number
          equipment: 'academia_completa' | 'casa' | 'halteres' | 'elasticos'
          restrictions: string | null
          body_measurements: Json | null
          bioimpedance: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gender: 'masculino' | 'feminino' | 'outro'
          age: number
          weight: number
          height: number
          goal: 'hipertrofia' | 'emagrecimento' | 'fortalecimento'
          experience_level: 'iniciante' | 'intermediario' | 'avancado'
          training_days_per_week: number
          equipment: 'academia_completa' | 'casa' | 'halteres' | 'elasticos'
          restrictions?: string | null
          body_measurements?: Json | null
          bioimpedance?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gender?: 'masculino' | 'feminino' | 'outro'
          age?: number
          weight?: number
          height?: number
          goal?: 'hipertrofia' | 'emagrecimento' | 'fortalecimento'
          experience_level?: 'iniciante' | 'intermediario' | 'avancado'
          training_days_per_week?: number
          equipment?: 'academia_completa' | 'casa' | 'halteres' | 'elasticos'
          restrictions?: string | null
          body_measurements?: Json | null
          bioimpedance?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          name_en: string | null
          muscle_group: string
          secondary_muscles: string[] | null
          equipment: string
          difficulty: 'iniciante' | 'intermediario' | 'avancado'
          instructions: string | null
          youtube_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_en?: string | null
          muscle_group: string
          secondary_muscles?: string[] | null
          equipment: string
          difficulty: 'iniciante' | 'intermediario' | 'avancado'
          instructions?: string | null
          youtube_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_en?: string | null
          muscle_group?: string
          secondary_muscles?: string[] | null
          equipment?: string
          difficulty?: 'iniciante' | 'intermediario' | 'avancado'
          instructions?: string | null
          youtube_url?: string | null
          created_at?: string
        }
      }
      workout_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          goal: string
          experience_level: string
          training_days_per_week: number
          equipment: string
          plan_data: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          goal: string
          experience_level: string
          training_days_per_week: number
          equipment: string
          plan_data: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          goal?: string
          experience_level?: string
          training_days_per_week?: number
          equipment?: string
          plan_data?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          user_id: string | null
          email: string
          interests: Json | null
          status: 'pending' | 'invited' | 'converted'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          interests?: Json | null
          status?: 'pending' | 'invited' | 'converted'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          interests?: Json | null
          status?: 'pending' | 'invited' | 'converted'
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string | null
          event_name: string
          event_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_name: string
          event_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_name?: string
          event_data?: Json | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Exercise = Database['public']['Tables']['exercises']['Row']
export type WorkoutPlan = Database['public']['Tables']['workout_plans']['Row']
export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']
export type Event = Database['public']['Tables']['events']['Row']
