// ====================================
// Supabase Configuration
// ====================================

const SUPABASE_URL = 'https://wetunpfxuxdcaicyxhkq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldHVucGZ4dXhkY2FpY3l4aGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjkyMjUsImV4cCI6MjA4MDUwNTIyNX0.XhiTFD5oA-YWofQhEOTaVleqzvYaRUdc_NAtAocyk_4';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for global access
window.supabaseClient = supabase;
window.SUPABASE_URL = SUPABASE_URL;

console.log('✅ Supabase initialized successfully');
