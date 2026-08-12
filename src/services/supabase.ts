import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uhqyhsniwlgivdlxbpoj.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocXloc25pd2xnaXZkbHhicG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzIwNzgsImV4cCI6MjA5ODc0ODA3OH0.rPSGWKn2AkkV66bNhOm3COE6ojdl6lUhoe4spbI0xr0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  global: { fetch: fetch.bind(globalThis) }
});

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const { data, error } = await supabase.from('companies').select('ticker').limit(1).abortSignal(controller.signal);
    clearTimeout(timeoutId);
    return !error && data !== null && data.length > 0;
  } catch {
    return false;
  }
}
