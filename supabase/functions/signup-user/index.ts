// Supabase Edge Function to create user with auto-confirm + send welcome email
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://wetunpfxuxdcaicyxhkq.supabase.co'
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_KEY')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

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
        const { email, password, firstName, lastName, profession } = await req.json()

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email and password are required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Create Supabase admin client
        const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY!, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        // Create user with email_confirm: true (auto-confirmed for immediate login)
        // But we mark email_verified: false in metadata to track real verification
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,  // Allow login immediately
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`,
                profession: profession,
                email_verified: false,  // Track real verification separately
                verification_sent_at: new Date().toISOString()
            }
        })

        if (error) {
            console.error('Signup error:', error)
            return new Response(
                JSON.stringify({ error: error.message }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Generate verification token (simple base64 of user ID + timestamp)
        const verificationToken = btoa(`${data.user.id}:${Date.now()}`)
        const verificationLink = `https://ownittheibrahim.tech/verify.html?token=${verificationToken}`

        // Send welcome + verification email via Resend
        try {
            const emailRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'OwnIt <noreply@ownittheibrahim.tech>',
                    to: [email],
                    subject: '🎉 Bienvenue sur OwnIt - Confirmez votre email',
                    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
                    .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
                    .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
                    .btn { display: inline-block; background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); color: white !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                    .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
                    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                    .highlight { color: #D4A373; }
                    .features { background: #2d2d2d; border-radius: 12px; padding: 20px; margin: 20px 0; }
                    .feature { margin: 10px 0; color: #a0a0a0; }
                    .warning { background: #3d2929; border-left: 4px solid #ff6b6b; padding: 12px; border-radius: 4px; margin: 20px 0; color: #ff9999; font-size: 13px; text-align: left; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">🌍 OwnIt</div>
                    
                    <p class="message" style="font-size: 20px;">Bienvenue <span class="highlight">${firstName}</span>! 🎉</p>
                    <p class="message">Merci de rejoindre OwnIt, la plateforme où chaque voix porte une histoire.</p>
                    
                    <div style="text-align: center;">
                        <a href="${verificationLink}" class="btn">✅ Confirmer mon email</a>
                    </div>
                    
                    <div class="features">
                        <div class="feature">🎤 Racontez votre histoire avec votre voix</div>
                        <div class="feature">🔒 Sécurité maximale avec 2FA</div>
                        <div class="feature">🌍 Réseau professionnel africain</div>
                    </div>
                    
                    <div class="warning">
                        ⚠️ <strong>Important:</strong> Vous avez 7 jours pour confirmer votre email. Après ce délai, votre compte sera automatiquement supprimé.
                    </div>
                    
                    <div class="footer">
                        <p>L'équipe OwnIt</p>
                        <p>Chaque voix porte une histoire 🎤</p>
                    </div>
                </div>
            </body>
            </html>
          `,
                }),
            })

            const emailData = await emailRes.json()
            console.log('Welcome email sent:', emailData)
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
            // Don't fail signup if email fails
        }

        return new Response(
            JSON.stringify({
                success: true,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: `${firstName} ${lastName}`,
                    profession: profession
                }
            }),
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
