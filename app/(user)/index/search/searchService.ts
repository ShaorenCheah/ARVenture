'use client';

export interface GooglePlace {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  vicinity?: string;
  types?: string[];
  photos?: { photo_reference: string }[];
}

export interface GooglePlaceDetails {
  name: string;
  rating?: number;
  price_level?: number;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  photos?: { photo_reference: string }[];
  reviews?: {
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    profile_photo_url: string;
  }[];
  user_ratings_total?: number;
}

export interface PlaceSuggestion {
  name: string;
  place_id: string;
}

interface GoogleAutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text?: string;
  };
}

// Get photo URL from reference
export function getPhotoUrl(photoReference: string, maxWidth = 400): string {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${key}`;
}

// Fetch place details by ID
export async function fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
  const res = await fetch(`/api/googlePlaces?type=details&place_id=${placeId}`);
  const data = await res.json();
  return data.result;
}

// Fetch nearby places
export async function fetchPlaces(
  keyword: string = '',
  category: string = '',
  lat?: number,
  lng?: number
): Promise<GooglePlace[]> {
  const params = new URLSearchParams({
    type: 'nearby',
    keyword,
    category,
  });

  if (lat && lng) {
    params.set('lat', lat.toString());
    params.set('lng', lng.toString());
  }

  const res = await fetch(`/api/googlePlaces?${params.toString()}`);
  const data = await res.json();
  return data.results || [];
}

// Fetch autocomplete suggestions
export async function fetchSuggestions(
  input: string,
  category?: string
): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    type: 'autocomplete',
    input,
  });

  const res = await fetch(`/api/googlePlaces?${params.toString()}`);
  const data = await res.json();

  let suggestions =
    data.predictions?.map((p: GoogleAutocompletePrediction) => ({
      name: p.structured_formatting?.main_text || p.description,
      place_id: p.place_id,
    })) || [];

  // If a category is selected, do a secondary check using Place Details
  if (category) {
    // Run Place Details in parallel
    const filtered = await Promise.all(
      suggestions.map(async (s: { place_id: string }) => {
        try {
          const details = await fetchPlaceDetails(s.place_id);
          return details.types?.includes(category) ? s : null;
        } catch {
          return null;
        }
      })
    );
    suggestions = filtered.filter(Boolean) as PlaceSuggestion[];
  }

  return suggestions;
}
