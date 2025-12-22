import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
    if (!supabaseClient) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
}

// For backwards compatibility
export const supabase = {
    from: (table: string) => getSupabase().from(table)
};

// Database helper functions
export async function getOffers() {
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getOffer(id: string) {
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createOffer(offer: Omit<import('./types').Offer, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('offers')
        .insert(offer)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getProspects(campaignId?: string) {
    let query = supabase.from('prospects').select('*');

    if (campaignId) {
        query = query.eq('campaign_id', campaignId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function createProspects(prospects: Omit<import('./types').Prospect, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
        .from('prospects')
        .insert(prospects)
        .select();

    if (error) throw error;
    return data;
}

export async function updateProspectStatus(id: string, status: import('./types').Prospect['status']) {
    const { data, error } = await supabase
        .from('prospects')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getCampaigns() {
    const { data, error } = await supabase
        .from('campaigns')
        .select('*, offers(*)')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function createCampaign(campaign: Omit<import('./types').Campaign, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function saveGeneratedEmail(email: Omit<import('./types').Email, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('emails')
        .insert(email)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateEmailStatus(id: string, status: import('./types').Email['status'], timestamp?: string) {
    const updates: Record<string, unknown> = { status };

    if (status === 'sent') updates.sent_at = timestamp || new Date().toISOString();
    if (status === 'opened') updates.opened_at = timestamp || new Date().toISOString();
    if (status === 'clicked') updates.clicked_at = timestamp || new Date().toISOString();

    const { data, error } = await supabase
        .from('emails')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
