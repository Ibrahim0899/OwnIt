import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { saveGeneratedEmail, updateEmailStatus } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, subject, body: emailBody, prospect_id, offer_id, save = true } = body;

        if (!to || !subject || !emailBody) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, body' },
                { status: 400 }
            );
        }

        // Save email to database first
        let savedEmail = null;
        if (save && prospect_id && offer_id) {
            savedEmail = await saveGeneratedEmail({
                prospect_id,
                offer_id,
                subject,
                body: emailBody,
                status: 'scheduled',
            });
        }

        // Send the email
        const result = await sendEmail({
            to,
            subject,
            body: emailBody,
        });

        // Update status to sent
        if (savedEmail) {
            await updateEmailStatus(savedEmail.id, 'sent');
        }

        return NextResponse.json({
            success: true,
            email_id: savedEmail?.id,
            resend_id: result?.id,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send email' },
            { status: 500 }
        );
    }
}
