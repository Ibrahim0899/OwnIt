import { NextRequest, NextResponse } from 'next/server';
import { createOffer, getOffers, getOffer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const offer = await getOffer(id);
            return NextResponse.json({ offer });
        }

        const offers = await getOffers();
        return NextResponse.json({ offers });
    } catch (error) {
        console.error('Error fetching offers:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch offers' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, problems_solved, benefits, price_range, target_sectors, target_company_size } = body;

        if (!name || !description) {
            return NextResponse.json(
                { error: 'Name and description are required' },
                { status: 400 }
            );
        }

        const offer = await createOffer({
            name,
            description,
            problems_solved: problems_solved || [],
            benefits: benefits || [],
            price_range: price_range || '',
            target_sectors: target_sectors || [],
            target_company_size: target_company_size || '',
        });

        return NextResponse.json({ success: true, offer });
    } catch (error) {
        console.error('Error creating offer:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create offer' },
            { status: 500 }
        );
    }
}
