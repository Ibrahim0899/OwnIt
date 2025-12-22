import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedEmail } from '@/lib/openai';
import { Offer, Prospect } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { offer, prospect } = body as { offer: Offer; prospect: Prospect };

        if (!offer || !prospect) {
            return NextResponse.json(
                { error: 'Missing offer or prospect data' },
                { status: 400 }
            );
        }

        const generatedEmail = await generatePersonalizedEmail(offer, prospect);

        return NextResponse.json({
            success: true,
            email: generatedEmail,
            prospect_id: prospect.id,
            offer_id: offer.id,
        });
    } catch (error) {
        console.error('Error generating email:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate email' },
            { status: 500 }
        );
    }
}
