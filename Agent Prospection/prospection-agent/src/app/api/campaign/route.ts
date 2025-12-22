import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedEmail, enrichProspectPainPoints } from '@/lib/openai';
import { sendEmail } from '@/lib/resend';
import { getOffer, getProspects, saveGeneratedEmail, updateEmailStatus, updateProspectStatus } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { offer_id, prospect_ids, send_immediately = false, delay_between_emails = 2000 } = body;

        if (!offer_id) {
            return NextResponse.json(
                { error: 'offer_id is required' },
                { status: 400 }
            );
        }

        // Get the offer
        const offer = await getOffer(offer_id);
        if (!offer) {
            return NextResponse.json(
                { error: 'Offer not found' },
                { status: 404 }
            );
        }

        // Get prospects (all or specific ones)
        let prospects = await getProspects();
        if (prospect_ids && Array.isArray(prospect_ids)) {
            prospects = prospects.filter((p: { id: string }) => prospect_ids.includes(p.id));
        }

        // Filter only new prospects
        prospects = prospects.filter((p: { status: string }) => p.status === 'new');

        const results: Array<{
            prospect_id: string;
            email: string;
            status: 'generated' | 'sent' | 'error';
            subject?: string;
            error?: string;
        }> = [];

        for (const prospect of prospects) {
            try {
                // Enrich with pain points if not already done
                if (!prospect.pain_points || prospect.pain_points.length === 0) {
                    prospect.pain_points = await enrichProspectPainPoints(prospect, offer);
                }

                // Generate personalized email
                const generatedEmail = await generatePersonalizedEmail(offer, prospect);

                // Save to database
                const savedEmail = await saveGeneratedEmail({
                    prospect_id: prospect.id,
                    offer_id: offer.id,
                    subject: generatedEmail.subject,
                    body: generatedEmail.body,
                    status: send_immediately ? 'scheduled' : 'draft',
                });

                let status: 'generated' | 'sent' = 'generated';

                // Send if requested
                if (send_immediately) {
                    await sendEmail({
                        to: prospect.email,
                        subject: generatedEmail.subject,
                        body: generatedEmail.body,
                    });

                    await updateEmailStatus(savedEmail.id, 'sent');
                    await updateProspectStatus(prospect.id, 'contacted');
                    status = 'sent';

                    // Rate limiting delay
                    if (delay_between_emails > 0) {
                        await new Promise(resolve => setTimeout(resolve, delay_between_emails));
                    }
                }

                results.push({
                    prospect_id: prospect.id,
                    email: prospect.email,
                    status,
                    subject: generatedEmail.subject,
                });
            } catch (error) {
                results.push({
                    prospect_id: prospect.id,
                    email: prospect.email,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        const summary = {
            total: results.length,
            generated: results.filter(r => r.status === 'generated').length,
            sent: results.filter(r => r.status === 'sent').length,
            errors: results.filter(r => r.status === 'error').length,
        };

        return NextResponse.json({
            success: true,
            summary,
            results,
        });
    } catch (error) {
        console.error('Error in campaign:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Campaign failed' },
            { status: 500 }
        );
    }
}
