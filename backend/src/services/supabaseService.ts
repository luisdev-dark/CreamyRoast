// src/services/supabaseService.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL || '';
// const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock para desarrollo
export const mockSupabase = {
  auth: {
    signInWithPassword: async (credentials: any) => {
      // Mock implementation
      return { data: null, error: null };
    }
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null })
  })
};

export default mockSupabase;