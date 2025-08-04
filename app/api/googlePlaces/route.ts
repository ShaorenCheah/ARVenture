import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const LOCATION = '3.0725,101.607';
const RADIUS = 1500;

const BOUNDING_BOX = {
  north: 3.085,
  south: 3.06,
  east: 101.62,
  west: 101.59,
};
function isWithinBoundingBox(lat: number, lng: number): boolean {
  return (
    lat >= BOUNDING_BOX.south &&
    lat <= BOUNDING_BOX.north &&
    lng >= BOUNDING_BOX.west &&
    lng <= BOUNDING_BOX.east
  );
}

// Tourist-friendly categories for initial recommendations
const TOURIST_FRIENDLY_TYPES = [
  'restaurant',
  'shopping_mall',
  'tourist_attraction',
  'cafe',
  'amusement_park',
  'movie_theater',
  'museum',
  'park',
  'store',
  'point_of_interest',
  'establishment',
];

// Categories to exclude from recommendations (less tourist-friendly)
const EXCLUDE_FROM_RECOMMENDATIONS = [
  'lodging',
  'hospital',
  'pharmacy',
  'bank',
  'atm',
  'gas_station',
  'car_repair',
  'real_estate_agency',
  'insurance_agency',
  'lawyer',
  'dentist',
  'veterinary_care',
  'transit_station',
  'gym',
];

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
  types?: string[];
  rating?: number;
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
  const isRecommendation = searchParams.get('recommendation') === 'true';

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

      case 'nearby': {
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        const locationParam = lat && lng ? `${lat},${lng}` : LOCATION;

        Object.assign(params, {
          keyword,
          type: category,
          location: locationParam,
          radius: RADIUS.toString(),
        });

        {
          const response = await axios.get<GoogleNearbySearchResponse>(url, { params });
          const results = response.data.results || [];

          let filtered: GooglePlaceResult[];

          if (isRecommendation) {
            // For initial recommendations: tourist-friendly places with high ratings
            filtered = results.filter((place: GooglePlaceResult) => {
              const placeLat = place.geometry?.location.lat;
              const placeLng = place.geometry?.location.lng;

              // Must be within Bandar Sunway
              const isInSunway =
                placeLat !== undefined &&
                placeLng !== undefined &&
                isWithinBoundingBox(placeLat, placeLng);

              if (!isInSunway) return false;

              // Must be tourist-friendly type
              const isTouristFriendly =
                Array.isArray(place.types) &&
                place.types.some((t) => TOURIST_FRIENDLY_TYPES.includes(t));

              // Should not be excluded types
              const isNotExcluded =
                !Array.isArray(place.types) ||
                !place.types.some((t) => EXCLUDE_FROM_RECOMMENDATIONS.includes(t));

              // Must have high rating (4.0+) or be a major attraction
              const isHighlyRated = typeof place.rating === 'number' && place.rating >= 4.0;
              const isMajorAttraction =
                Array.isArray(place.types) && place.types.includes('tourist_attraction');

              return isTouristFriendly && isNotExcluded && (isHighlyRated || isMajorAttraction);
            });

            // Sort by rating (highest first) and limit to top results
            filtered.sort((a, b) => {
              const ratingA = a.rating || 0;
              const ratingB = b.rating || 0;
              return ratingB - ratingA;
            });

            // Take top 15 results for recommendations
            filtered = filtered.slice(0, 15);
          } else {
            // For search results: more lenient filtering
            filtered = results.filter((place: GooglePlaceResult) => {
              const placeLat = place.geometry?.location.lat;
              const placeLng = place.geometry?.location.lng;

              // Must be within Bandar Sunway
              const isInSunway =
                placeLat !== undefined &&
                placeLng !== undefined &&
                isWithinBoundingBox(placeLat, placeLng);

              // For search results, we're more permissive with ratings
              // Allow places with rating 3.5+ or places without ratings
              const hasGoodRating = !place.rating || place.rating >= 3.5;

              return isInSunway && hasGoodRating;
            });

            // Sort by rating but keep more results
            filtered.sort((a, b) => {
              const ratingA = a.rating || 0;
              const ratingB = b.rating || 0;
              return ratingB - ratingA;
            });
          }

          return NextResponse.json({ results: filtered });
        }
      }

      case 'details':
        if (!placeId) {
          return NextResponse.json({ error: 'Missing place_id' }, { status: 400 });
        }

        url = 'https://maps.googleapis.com/maps/api/place/details/json';
        Object.assign(params, {
          place_id: placeId,
          fields:
            'name,formatted_address,geometry,types,website,formatted_phone_number,rating,user_ratings_total,opening_hours,price_level,photos,reviews',
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
