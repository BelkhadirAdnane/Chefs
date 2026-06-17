import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      chef_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          cin: string;
          can: string;
          phone: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          cin: string;
          can: string;
          phone: string;
          role: string;
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
