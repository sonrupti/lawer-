import { createBrowserClient } from '@supabase/ssr';

// Retrieve Supabase URL and public Anon Key from our environment variables.
// These variables are loaded automatically from the .env.local file.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create and export the Supabase browser client using @supabase/ssr.
// createBrowserClient persists the session in cookies (not localStorage),
// which is required for the App Router SSR pattern to work correctly.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
