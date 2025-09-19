import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      beefarena_users: {
        Row: {
          id: string
          created_at: string
          email: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string | null
        }
      }
      beefarena_generations: {
        Row: {
          id: string
          user_id: string | null
          selfie_url: string
          opponent_slug: string
          style: string
          result_url: string | null
          captions: string[]
          status: 'pending' | 'generating' | 'completed' | 'failed'
          safety_flags: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          selfie_url: string
          opponent_slug: string
          style: string
          result_url?: string | null
          captions?: string[]
          status?: 'pending' | 'generating' | 'completed' | 'failed'
          safety_flags?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          selfie_url?: string
          opponent_slug?: string
          style?: string
          result_url?: string | null
          captions?: string[]
          status?: 'pending' | 'generating' | 'completed' | 'failed'
          safety_flags?: Record<string, unknown> | null
          created_at?: string
        }
      }
      beefarena_opponents: {
        Row: {
          id: string
          name: string
          slug: string
          nickname: string
          base_photo_url: string
          allowed: boolean
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          nickname: string
          base_photo_url: string
          allowed?: boolean
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          nickname?: string
          base_photo_url?: string
          allowed?: boolean
          description?: string
          created_at?: string
        }
      }
      beefarena_templates: {
        Row: {
          id: string
          name: string
          slug: string
          style_prompt: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          style_prompt: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          style_prompt?: string
          description?: string
          created_at?: string
        }
      }
    }
  }
} 