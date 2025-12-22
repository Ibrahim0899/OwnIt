import { NextRequest, NextResponse } from 'next/server';
import { getProspects, createProspects } from '@/lib/supabase';
import { Prospect } from '@/lib/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const campaignId = searchParams.get('campaign_id');

        const prospects = await getProspects(campaignId || undefined);
        return NextResponse.json({ prospects });
    } catch (error) {
        console.error('Error fetching prospects:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch prospects' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prospects } = body as { prospects: Omit<Prospect, 'id' | 'created_at'>[] };

        if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
            return NextResponse.json(
                { error: 'Prospects array is required' },
                { status: 400 }
            );
        }

        // Validate required fields
        for (const prospect of prospects) {
            if (!prospect.email || !prospect.first_name || !prospect.company) {
                return NextResponse.json(
                    { error: 'Each prospect must have email, first_name, and company' },
                    { status: 400 }
                );
            }
        }

        const createdProspects = await createProspects(prospects);
        return NextResponse.json({
            success: true,
            count: createdProspects.length,
            prospects: createdProspects
        });
    } catch (error) {
        console.error('Error creating prospects:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create prospects' },
            { status: 500 }
        );
    }
}
