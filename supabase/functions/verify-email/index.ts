// Supabase Edge Function to verify email from token
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://wetunpfxuxdcaicyxhkq.supabase.co'
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { token } = await req.json()

        if (!token) {
            return new Response(
                JSON.stringify({ error: 'Token is required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Decode token
        let userId: string
        try {
            const decoded = atob(token)
            const parts = decoded.split(':')
            userId = parts[0]
        } catch {
            return new Response(
                JSON.stringify({ error: 'Token invalide' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Create Supabase admin client
        const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY!, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        // Get user
        const { data: userData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)

        if (getUserError || !userData.user) {
            return new Response(
                JSON.stringify({ error: 'Utilisateur non trouvé' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            )
        }

        // Check if already verified
        if (userData.user.user_metadata?.email_verified === true) {
            return new Response(
                JSON.stringify({ alreadyVerified: true }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Update user to mark email as verified
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUser(userId, {
            user_metadata: {
                ...userData.user.user_metadata,
                email_verified: true,
                verified_at: new Date().toISOString()
            }
        })

        if (updateError) {
            console.error('Update error:', updateError)
            return new Response(
                JSON.stringify({ error: 'Erreur lors de la vérification' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            )
        }

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
