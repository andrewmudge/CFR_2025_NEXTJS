import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    if (!year) {
      return NextResponse.json({ error: 'Year parameter required' }, { status: 400 });
    }

    // Call Lambda function
    const lambdaResponse = await fetch(`${process.env.LIST_LAMBDA_URL}?year=${year}`);
    const photos = await lambdaResponse.json();

    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}