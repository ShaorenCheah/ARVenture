/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const BASE_URL = 'https://api.foursquare.com/v3/places/search';
const DETAILS_URL = 'https://api.foursquare.com/v3/places';

// Bandar Sunway coordinates (centered around Sunway Pyramid)
const SUNWAY_COORDINATES = '3.0725,101.607';
const SUNWAY_RADIUS = 1500; // 1.5km radius to cover the main Bandar Sunway area

export const fetchPlaces = async (query: string, category: string = '') => {
  const params: Record<string, any> = {
    ll: SUNWAY_COORDINATES,
    radius: SUNWAY_RADIUS,
    sort: 'RATING', // Sort by rating for better tourist experience
    limit: 30,
    // Request additional fields for tourist information
    fields:
      'fsq_id,name,location,categories,rating,price,photos,hours,website,tel,email,description,tips,popularity,stats',
  };

  if (query) params.query = query;
  if (category) params.categories = category;

  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY!,
        Accept: 'application/json',
      },
      params,
    });

    // Sort results by rating first, then by popularity
    const sortedResults = response.data.results.sort((a: any, b: any) => {
      // Places with ratings come first
      if (a.rating && !b.rating) return -1;
      if (!a.rating && b.rating) return 1;

      // If both have ratings, sort by rating (descending)
      if (a.rating && b.rating) {
        return b.rating - a.rating;
      }

      // If neither has rating, sort by popularity/stats
      const aPopularity = a.popularity || a.stats?.total_checkins || 0;
      const bPopularity = b.popularity || b.stats?.total_checkins || 0;
      return bPopularity - aPopularity;
    });

    return sortedResults;
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

export const fetchSuggestions = async (query: string, category: string = '') => {
  const params: Record<string, any> = {
    ll: SUNWAY_COORDINATES,
    radius: SUNWAY_RADIUS,
    query,
    sort: 'RELEVANCE',
    limit: 8, // Increased for better suggestions
    fields: 'fsq_id,name,rating,categories',
  };

  if (category) params.categories = category;

  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY!,
        Accept: 'application/json',
      },
      params,
    });

    // Return suggestions with ratings for better UX
    return response.data.results.map((item: any) => ({
      name: item.name,
      rating: item.rating,
      fsq_id: item.fsq_id,
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// New function to get detailed place information
export const fetchPlaceDetails = async (fsq_id: string) => {
  try {
    const response = await axios.get(`${DETAILS_URL}/${fsq_id}`, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY!,
        Accept: 'application/json',
      },
      params: {
        fields:
          'fsq_id,name,location,categories,rating,price,photos,hours,website,tel,email,description,tips,menu,social_media,date_closed,hours_popular,stats,popularity,tastes',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

// Get photos for a place
export const fetchPlacePhotos = async (fsq_id: string) => {
  try {
    const response = await axios.get(`${DETAILS_URL}/${fsq_id}/photos`, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY!,
        Accept: 'application/json',
      },
      params: {
        limit: 10,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

// Get tips/reviews for a place
export const fetchPlaceTips = async (fsq_id: string) => {
  try {
    const response = await axios.get(`${DETAILS_URL}/${fsq_id}/tips`, {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY!,
        Accept: 'application/json',
      },
      params: {
        limit: 10,
        sort: 'POPULAR',
      },
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching tips:', error);
    return [];
  }
};
