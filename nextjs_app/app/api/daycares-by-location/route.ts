import { NextRequest, NextResponse } from 'next/server';

const TORONTO_API_BASE = 'https://services3.arcgis.com/b9WvedVPoizGfvfD/arcgis/rest/services/COTGEO_LICENSED_CHILD_CARE/FeatureServer/0/query';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const x = searchParams.get('x');
  const y = searchParams.get('y');
  const distance = searchParams.get('distance') || '5000';

  if (!x || !y) {
    return NextResponse.json({ error: 'x and y coordinates are required' }, { status: 400 });
  }

  try {
    // Build query parameters
    const params = new URLSearchParams({
      f: 'geojson',
      where: '1=1',
      outFields: '*',
      outSR: '4326',
      returnGeometry: 'true',
      geometry: JSON.stringify({
        x: parseFloat(x),
        y: parseFloat(y),
        spatialReference: { wkid: 4326 }
      }),
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      distance: distance,
      units: 'esriSRUnit_Meter',
      resultRecordCount: '100'
    });

    const url = `${TORONTO_API_BASE}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching daycares by location:', error);
    return NextResponse.json({ error: 'Failed to fetch daycares by location' }, { status: 500 });
  }
}