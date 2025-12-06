// Supabase Edge Function to send 2FA emails via Resend
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { email, code } = await req.json()

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'OwnIt <noreply@ownittheibrahim.tech>',
        to: [email],
        subject: '🔐 OwnIt - Votre code de vérification',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <style>
                  body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
                  .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
                  .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
                  .code-box { background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0; }
                  .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff; font-family: monospace; }
                  .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
                  .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                  .highlight { color: #D4A373; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="logo">🌍 OwnIt</div>
                  
                  <p class="message">Bonjour,</p>
                  <p class="message">Voici votre code de vérification pour vous connecter à <span class="highlight">OwnIt</span>:</p>
                  
                  <div class="code-box">
                      <div class="code">${code}</div>
                  </div>
                  
                  <p class="message">Ce code expire dans <strong>5 minutes</strong>.</p>
                  <p class="message">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
                  
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

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend error:', data)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
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
