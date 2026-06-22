import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Frontend needs VITE_ prefixed variables set in environment
// Fallback to hardcoded URL if environment not set (development fallback)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://hwglhastcmqgrvvxmaae.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3Z2xoYXN0Y21xZ3J2dnhtYWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDMzNzgsImV4cCI6MjA4OTI3OTM3OH0.AygQOrS3YAvUgbjHW_ypCMWNqH7pIY6U6NUm7Pgt_Go';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('PLACEHOLDER')) {
    throw new Error('Missing or invalid Supabase configuration. Check your environment variables.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Export a lazy-loaded proxy for backward compatibility
export const supabase = {
  from: (table: string) => getSupabaseClient().from(table),
  auth: () => getSupabaseClient().auth,
  storage: () => getSupabaseClient().storage,
  channel: (name: string) => getSupabaseClient().channel(name),
} as any;

export type Database = {
  public: {
    Tables: {
      user_chefs: {
        Row: {
          id: string;
          cin: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          can: string;
          phone: string;
          role: string;
          password_hash: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cin: string;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          can: string;
          phone: string;
          role: string;
          password_hash: string;
        };
      };
      members: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          branch: string | null;
          patrol: string | null;
          role: string | null;
          tutor_name: string | null;
          tutor_phone: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          branch?: string | null;
          patrol?: string | null;
          role?: string | null;
          tutor_name?: string | null;
          tutor_phone?: string | null;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          patrol: string | null;
          activity: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          content: string;
          patrol?: string | null;
          activity?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string | null;
          location: string | null;
          responsible: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date?: string | null;
          location?: string | null;
          responsible?: string | null;
        };
      };
      ideas: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          status: 'new' | 'in_review' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          content: string;
          status?: 'new' | 'in_review' | 'approved' | 'rejected';
        };
      };
    };
  };
};
