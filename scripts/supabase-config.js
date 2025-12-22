// ====================================
// Supabase Configuration
// ====================================

const SUPABASE_URL = 'https://wetunpfxuxdcaicyxhkq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldHVucGZ4dXhkY2FpY3l4aGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjkyMjUsImV4cCI6MjA4MDUwNTIyNX0.XhiTFD5oA-YWofQhEOTaVleqzvYaRUdc_NAtAocyk_4';

// Initialize Supabase client with error handling
try {
    if (!window.supabase) {
        throw new Error('Supabase library not loaded. Make sure the CDN script is included before this file.');
    }

    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Export for global access
    window.supabaseClient = supabaseClient;
    window.SUPABASE_URL = SUPABASE_URL;

    console.log('✅ Supabase initialized successfully');
} catch (error) {
    console.error('❌ Supabase initialization failed:', error.message);

    // Create a mock client to prevent crashes (will show errors when used)
    window.supabaseClient = {
        auth: {
            signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
            signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
            signOut: async () => ({ error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null })
        },
        from: () => ({
            select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            delete: () => ({ data: null, error: { message: 'Supabase not configured' } })
        })
    };
}
