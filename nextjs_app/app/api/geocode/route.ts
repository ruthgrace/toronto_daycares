import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyString = searchParams.get('keyString');

  if (!keyString) {
    return NextResponse.json({ error: 'keyString parameter is required' }, { status: 400 });
  }

  try {
    const url = `https://map.toronto.ca/cotgeocoder/rest/geocoder/findAddressCandidates?f=json&keyString=${encodeURIComponent(keyString)}&retRowLimit=10`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to a consistent format
    const candidates = data.result?.rows?.map((row: any) => ({
      address: row.ADDRESS_FULL,
      location: {
        x: row.LONGITUDE,
        y: row.LATITUDE
      },
      score: row.SCORE
    })) || [];
    
    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('Error geocoding address:', error);
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 500 });
  }
}