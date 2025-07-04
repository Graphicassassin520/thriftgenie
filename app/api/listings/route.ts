
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const listings = await prisma.listing.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        platformContent: true
      }
    });

    const total = await prisma.listing.count();

    return NextResponse.json({
      success: true,
      data: {
        listings,
        total,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Listings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
