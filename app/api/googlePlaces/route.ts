import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const LOCATION = '3.0725,101.607';
const RADIUS = 1500;

const BOUNDING_BOX = {
  north: 3.082,
  south: 3.063,
  east: 101.615,
  west: 101.595,
};

function isWithinBoundingBox(lat: number, lng: number): boolean {
  return (
    lat >= BOUNDING_BOX.south &&
    lat <= BOUNDING_BOX.north &&
    lng >= BOUNDING_BOX.west &&
    lng <= BOUNDING_BOX.east
  );
}

// === Type definitions ===

interface GooglePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface GoogleAutocompleteResponse {
  predictions: GooglePrediction[];
  status: string;
}

interface GooglePlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  geometry?: GooglePlaceGeometry;
  [key: string]: unknown; // allow extra fields without any
}

interface GoogleNearbySearchResponse {
  results: GooglePlaceResult[];
  status: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const input = searchParams.get('input') || '';
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const placeId = searchParams.get('place_id');

  try {
    let url = '';
    const params: Record<string, string> = { key: GOOGLE_API_KEY };

    switch (type) {
      case 'autocomplete':
        url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        Object.assign(params, {
          input,
          location: LOCATION,
          radius: RADIUS.toString(),
          types: 'establishment',
        });

        {
          const response = await axios.get<GoogleAutocompleteResponse>(url, { params });
          const predictions = response.data.predictions || [];

          const filtered = predictions.filter((item: GooglePrediction) =>
            item.description.toLowerCase().includes('bandar sunway')
          );

          return NextResponse.json({ predictions: filtered });
        }

      case 'nearby':
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        Object.assign(params, {
          keyword,
          type: category,
          location: LOCATION,
          radius: RADIUS.toString(),
        });

        {
          const response = await axios.get<GoogleNearbySearchResponse>(url, { params });
          const results = response.data.results || [];

          const filtered = results.filter((place: GooglePlaceResult) => {
            const lat = place.geometry?.location.lat;
            const lng = place.geometry?.location.lng;
            return lat !== undefined && lng !== undefined && isWithinBoundingBox(lat, lng);
          });

          return NextResponse.json({ results: filtered });
        }

      case 'details':
        if (!placeId) {
          return NextResponse.json({ error: 'Missing place_id' }, { status: 400 });
        }

        url = 'https://maps.googleapis.com/maps/api/place/details/json';
        Object.assign(params, {
          place_id: placeId,
          fields:
            'name,formatted_address,geometry,types,website,formatted_phone_number,rating,opening_hours,price_level,photos,reviews',
        });

        {
          const response = await axios.get(url, { params });
          return NextResponse.json(response.data);
        }

      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Google Places API proxy error:', error);
    return NextResponse.json({ error: 'Google Places API failed' }, { status: 500 });
  }
}
