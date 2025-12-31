import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key is missing. Check .env file.');
    // Throwing here will crash the app (white screen), which is what is happening.
    // To show it on UI, we might need to handle it. 
    // For now, we'll let it throw but with a better message, and the new ErrorBoundary will hopefully catch it 
    // if we move the initialization inside a component or hook? 
    // No, services import this directly.
    // Let's create a dummy client that throws on usage to prevent white screen at startup
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase not initialized') }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase not initialized') }),
            signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
            select: () => ({ data: [], error: new Error('Supabase not initialized') }),
        })
        // Add other mocks as needed or just use a proxy to throw error on access
    };
