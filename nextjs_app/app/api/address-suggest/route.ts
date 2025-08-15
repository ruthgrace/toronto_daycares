import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchString = searchParams.get('searchString');

  if (!searchString) {
    return NextResponse.json({ error: 'searchString parameter is required' }, { status: 400 });
  }

  try {
    const url = `https://map.toronto.ca/cotgeocoder/rest/geocoder/suggest?f=json&addressOnly=0&retRowLimit=5&searchString=${encodeURIComponent(searchString)}`;
    
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
    const suggestions = data.result?.rows?.map((row: any) => ({
      keyString: row.KEYSTRING,
      address: row.ADDRESS
    })) || [];
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch address suggestions' }, { status: 500 });
  }
}