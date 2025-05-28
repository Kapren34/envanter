import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// More detailed error checking for Supabase configuration
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined in environment variables. Please check your .env file.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined in environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});

// Test the connection
supabase.from('system_settings').select('*', { count: 'exact', head: true })
  .then(() => {
    console.log('Successfully connected to Supabase');
  })
  .catch((error) => {
    console.error('Failed to connect to Supabase:', error.message);
    throw new Error('Failed to establish connection with Supabase. Please check your configuration.');
  });