import { NextRequest, NextResponse } from 'next/server';

const TORONTO_API_BASE = 'https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_LICENSED_CHILD_CARE/FeatureServer/0/query';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Build query parameters
    const params = new URLSearchParams({
      f: 'geojson',
      where: searchParams.get('where') || '1=1',
      outFields: '*',
      outSR: '4326',
      returnGeometry: 'true',
      spatialRel: 'esriSpatialRelIntersects',
      resultOffset: searchParams.get('offset') || '0',
      resultRecordCount: searchParams.get('limit') || '100',
    });

    const response = await fetch(`${TORONTO_API_BASE}?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching daycare data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daycare data' },
      { status: 500 }
    );
  }
}