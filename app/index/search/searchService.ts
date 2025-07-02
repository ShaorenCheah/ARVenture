import axios from 'axios';

// ======================
// Types
// ======================

export interface GoogleAutocompleteSuggestion {
  name: string;
  subtitle?: string;
  place_id: string;
}

interface GooglePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GoogleReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

export interface GooglePlace {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  vicinity?: string;
  types?: string[];
  photos?: { photo_reference: string }[];
}

export interface GooglePlaceDetails extends GooglePlace {
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
    open_now?: boolean;
    periods?: {
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }[];
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  reviews?: GoogleReview[];
}

// ======================
// Autocomplete
// ======================

export const fetchSuggestions = async (input: string): Promise<GoogleAutocompleteSuggestion[]> => {
  try {
    const response = await axios.get<{ predictions: GooglePrediction[] }>('/api/googlePlaces', {
      params: { type: 'autocomplete', input },
    });

    return response.data.predictions.map((item) => ({
      name: item.structured_formatting?.main_text || item.description,
      subtitle: item.structured_formatting?.secondary_text,
      place_id: item.place_id,
    }));
  } catch (error) {
    console.error('Error fetching autocomplete suggestions (proxy):', error);
    return [];
  }
};

// ======================
// Nearby Search
// ======================

export const fetchPlaces = async (query: string, category: string = ''): Promise<GooglePlace[]> => {
  try {
    const response = await axios.get<{ results: GooglePlace[] }>('/api/googlePlaces', {
      params: {
        type: 'nearby',
        keyword: query,
        category,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('Error fetching nearby places (proxy):', error);
    return [];
  }
};

// ======================
// Place Details
// ======================

export const fetchPlaceDetails = async (placeId: string): Promise<GooglePlaceDetails | null> => {
  try {
    const response = await axios.get<{ result: GooglePlaceDetails }>('/api/googlePlaces', {
      params: {
        type: 'details',
        place_id: placeId,
        fields: [
          'name',
          'formatted_address',
          'geometry',
          'types',
          'website',
          'formatted_phone_number',
          'rating',
          'opening_hours',
          'price_level',
          'photos',
          'reviews',
        ].join(','),
      },
    });

    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details (proxy):', error);
    return null;
  }
};

// ======================
// Photo URL Generator
// ======================

export const getPhotoUrl = (photoReference: string, maxWidth = 400): string => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
};
