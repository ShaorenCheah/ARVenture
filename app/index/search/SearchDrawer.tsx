'use client';

import AttractionsIcon from '@mui/icons-material/Attractions';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HotelIcon from '@mui/icons-material/Hotel';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MovieIcon from '@mui/icons-material/Movie';
import MuseumIcon from '@mui/icons-material/Museum';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import ParkIcon from '@mui/icons-material/Park';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StarIcon from '@mui/icons-material/Star';
import TempleBuddhistIcon from '@mui/icons-material/TempleBuddhist';
import WaterIcon from '@mui/icons-material/Water';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  InputAdornment,
  CircularProgress,
  alpha,
} from '@mui/material';
import React, { useState, useEffect, useRef, useCallback } from 'react';

import SearchResult from './SearchResult';
import { fetchPlaces, fetchSuggestions, fetchPlaceDetails, PlaceSuggestion } from './searchService';

export const categories = [
  { label: 'Food', type: 'restaurant', icon: <RestaurantIcon fontSize="small" /> },
  { label: 'Attractions', type: 'tourist_attraction', icon: <AttractionsIcon fontSize="small" /> },
  { label: 'Shopping', type: 'shopping_mall', icon: <LocalMallIcon fontSize="small" /> },
  { label: 'Cafes', type: 'cafe', icon: <LocalCafeIcon fontSize="small" /> },
  { label: 'Parks', type: 'park', icon: <ParkIcon fontSize="small" /> },
  { label: 'Entertainment', type: 'movie_theater', icon: <MovieIcon fontSize="small" /> },
  { label: 'Fitness', type: 'gym', icon: <FitnessCenterIcon fontSize="small" /> },
  { label: 'Nightlife', type: 'bar', icon: <NightlifeIcon fontSize="small" /> },
  { label: 'Hotels', type: 'lodging', icon: <HotelIcon fontSize="small" /> },
  { label: 'Museums', type: 'museum', icon: <MuseumIcon fontSize="small" /> },
  { label: 'Temples', type: 'place_of_worship', icon: <TempleBuddhistIcon fontSize="small" /> },
  { label: 'Water Parks', type: 'amusement_park', icon: <WaterIcon fontSize="small" /> },
  { label: 'Transport', type: 'transit_station', icon: <DirectionsBusIcon fontSize="small" /> },
  { label: 'Souvenirs', type: 'store', icon: <ShoppingBagIcon fontSize="small" /> },
  { label: 'Clinics', type: 'hospital', icon: <LocalHospitalIcon fontSize="small" /> },
  { label: 'Photo Spots', type: 'point_of_interest', icon: <CameraAltIcon fontSize="small" /> },
];

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface GooglePlace {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  vicinity?: string;
  types?: string[];
  photos?: { photo_reference: string }[];
}

type LocationStatus = 'pending' | 'granted' | 'denied' | 'not_in_area';
type SearchMode = 'initial' | 'searching' | 'nearby' | 'no_results';

export default function SearchDrawer({ open, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [results, setResults] = useState<GooglePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'result'>('search');
  const [loading, setLoading] = useState(false);

  type Suggestion = PlaceSuggestion;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const inputRef = useRef<HTMLInputElement>(null);

  // Consolidated location and search state
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('pending');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('initial');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounced search ref to prevent race conditions
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSearchRef = useRef<string>('');

  // Initialize location detection only once when drawer opens
  useEffect(() => {
    if (open && locationStatus === 'pending') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationStatus('granted');
            setUserCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            setLocationStatus('denied');
          }
        );
      } else {
        setLocationStatus('denied');
      }
    }
  }, [open, locationStatus]);

  // Handle initial nearby search after location is granted
  useEffect(() => {
    if (userCoords && locationStatus === 'granted' && isInitialLoad) {
      setIsInitialLoad(false);
      setLoading(true);
      setSearchMode('searching');

      fetchPlaces('', '', userCoords.lat, userCoords.lng)
        .then((places) => {
          const filtered = places.filter((place) =>
            place.vicinity?.toLowerCase().includes('bandar sunway')
          );

          if (filtered.length > 0) {
            setResults(filtered);
            setSearchMode('nearby');
          } else {
            setResults([]);
            setSearchMode('initial');
            setLocationStatus('not_in_area');
          }
        })
        .catch(() => {
          setResults([]);
          setSearchMode('initial');
          setLocationStatus('not_in_area');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userCoords, locationStatus, isInitialLoad]);

  // Handle search queries with proper debouncing
  const performSearch = useCallback(async (searchQuery: string, category: string) => {
    const searchKey = `${searchQuery}|${category}`;
    currentSearchRef.current = searchKey;

    setLoading(true);
    setSearchMode('searching');

    try {
      const places = await fetchPlaces(searchQuery, category);

      // Check if this is still the current search
      if (currentSearchRef.current === searchKey) {
        const filtered = places.filter((place) =>
          place.vicinity?.toLowerCase().includes('bandar sunway')
        );

        setResults(filtered);
        setSearchMode(filtered.length > 0 ? 'searching' : 'no_results');
      }
    } catch {
      if (currentSearchRef.current === searchKey) {
        setResults([]);
        setSearchMode('no_results');
      }
    } finally {
      if (currentSearchRef.current === searchKey) {
        setLoading(false);
      }
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If no query and no category, reset to initial state
    if (!query && !selectedCat) {
      setResults([]);
      if (locationStatus === 'granted' && userCoords) {
        // Return to nearby mode if location is available
        setSearchMode('nearby');
        // Re-fetch nearby places
        fetchPlaces('', '', userCoords.lat, userCoords.lng).then((places) => {
          const filtered = places.filter((place) =>
            place.vicinity?.toLowerCase().includes('bandar sunway')
          );
          setResults(filtered);
        });
      } else {
        setSearchMode('initial');
      }
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query, selectedCat);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, selectedCat, performSearch, locationStatus, userCoords]);

  // Handle suggestions
  useEffect(() => {
    if (query.trim() && showSuggestions) {
      fetchSuggestions(query, selectedCat).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, showSuggestions, selectedCat]);

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);

    if (inputRef.current) {
      inputRef.current.value = suggestion.name;
    }

    try {
      const details = await fetchPlaceDetails(suggestion.place_id);
      const lat = details.geometry?.location.lat;
      const lng = details.geometry?.location.lng;

      if (lat && lng) {
        setLoading(true);
        setSearchMode('searching');
        const places = await fetchPlaces('', '', lat, lng);

        const filtered = places.filter((place) =>
          place.vicinity?.toLowerCase().includes('bandar sunway')
        );

        setResults(filtered);
        setSearchMode(filtered.length > 0 ? 'searching' : 'no_results');
      }
    } catch (error) {
      console.error('Failed to fetch place details or results:', error);
      setResults([]);
      setSearchMode('no_results');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSelectedCat('');
    setSuggestions([]);
    setShowSuggestions(false);
    // Don't clear results here, let the effect handle it
  };

  const handlePlaceClick = (place: GooglePlace) => {
    setSelectedPlace(place);
    setCurrentView('result');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedPlace(null);
  };

  // Reset state when drawer closes
  useEffect(() => {
    if (!open) {
      setCurrentView('search');
      setSelectedPlace(null);
    }
  }, [open]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="200px"
          mt={4}
        >
          <CircularProgress size={24} sx={{ color: '#ED1D24' }} />
          <Typography variant="body2" color="text.secondary" mt={2} fontWeight={400}>
            Searching...
          </Typography>
        </Box>
      );
    }

    switch (searchMode) {
      case 'initial':
        if (locationStatus === 'pending') {
          return (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="200px"
              mt={4}
            >
              <CircularProgress size={24} sx={{ color: '#ED1D24' }} />
              <Typography variant="body2" color="text.secondary" mt={2} fontWeight={400}>
                Detecting your location...
              </Typography>
            </Box>
          );
        }

        if (locationStatus === 'denied' || locationStatus === 'not_in_area') {
          return (
            <Box
              textAlign="center"
              mt={6}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: alpha('#ED1D24', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <LocationOnIcon sx={{ fontSize: 48, color: 'brand.main' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
                {locationStatus === 'denied' ? 'Location Access Needed' : 'Explore Bandar Sunway'}
              </Typography>
              <Typography variant="body2" color="text.secondary" maxWidth="280px" lineHeight={1.5}>
                {locationStatus === 'denied'
                  ? 'Allow location access to find nearby spots, or search manually to explore.'
                  : 'Start searching to discover amazing places in Bandar Sunway area.'}
              </Typography>
            </Box>
          );
        }
        break;

      case 'nearby':
        return (
          <>
            <Typography variant="h5" fontWeight={600} mt={1} mb={2} color="text.primary">
              Nearby Places
            </Typography>
            {results.map((place) => (
              <PlaceCard key={place.place_id} place={place} onPlaceClick={handlePlaceClick} />
            ))}
          </>
        );

      case 'searching':
        return results.map((place) => (
          <PlaceCard key={place.place_id} place={place} onPlaceClick={handlePlaceClick} />
        ));

      case 'no_results':
        return (
          <Box
            textAlign="center"
            mt={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha('#8E8E93', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: 48 }}>🔍</Typography>
            </Box>
            <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
              No Results Found
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth="280px" lineHeight={1.5}>
              Try searching with different keywords or check a different category.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '100vh',
          borderRadius: { xs: 0, md: 2 },
          bgcolor: '#FAFAFA',
          maxWidth: isDesktop ? '600px' : '100%',
          mx: 'auto',
          border: 'none',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {currentView === 'search' ? (
          <>
            {/* Header */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                bgcolor: '#FAFAFA',
                zIndex: 1,
                px: 3,
                pt: 2,
                pb: 1,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h3" fontWeight={700} color="text.primary">
                  Search Nearby
                </Typography>
                <IconButton
                  onClick={onClose}
                  sx={{
                    bgcolor: alpha('#8E8E93', 0.1),
                    width: 32,
                    height: 32,
                    '&:hover': { bgcolor: alpha('#8E8E93', 0.2) },
                  }}
                >
                  <KeyboardReturnOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Categories */}
              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 1.5,
                  mb: 1,
                  pb: 1,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {categories.map((cat) => (
                  <Chip
                    key={cat.type}
                    label={cat.label}
                    icon={cat.icon}
                    clickable
                    variant={selectedCat === cat.type ? 'filled' : 'outlined'}
                    onClick={() => setSelectedCat((prev) => (prev === cat.type ? '' : cat.type))}
                    sx={{
                      minWidth: 'auto',
                      height: 34,
                      borderRadius: 10,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      px: 0.5,
                      ...(selectedCat === cat.type
                        ? {
                            bgcolor: 'brand.main',
                            color: 'white',
                            '&:hover': { bgcolor: '#ED1D24' },
                            '& .MuiChip-icon': { color: 'white' },
                          }
                        : {
                            bgcolor: 'white',
                            borderColor: alpha('#8E8E93', 0.3),
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: alpha('#ED1D24', 0.05),
                              borderColor: 'brand.main',
                            },
                            '& .MuiChip-icon': { color: 'text.secondary' },
                          }),
                    }}
                  />
                ))}
              </Box>

              {/* Search Field */}
              <Box sx={{ position: 'relative' }}>
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (query || selectedCat) && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClearSearch}
                          edge="end"
                          size="small"
                          sx={{
                            color: 'text.secondary',
                            bgcolor: alpha('#8E8E93', 0.1),
                            width: 24,
                            height: 24,
                            '&:hover': { bgcolor: alpha('#8E8E93', 0.2) },
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'transparent' },
                      '&:hover fieldset': { borderColor: alpha('#8E8E93', 0.3) },
                      '&.Mui-focused fieldset': {
                        borderColor: 'brand.main',
                        borderWidth: 1.5,
                      },
                      border: `1px solid ${alpha('#8E8E93', 0.2)}`,
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      fontWeight: 400,
                      py: 1.25,
                    },
                  }}
                />

                {/* Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      bgcolor: 'white',
                      zIndex: 10,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: `1px solid ${alpha('#8E8E93', 0.2)}`,
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {suggestions.map((sug, i) => (
                      <Box
                        key={i}
                        sx={{
                          px: 3,
                          py: 2,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: alpha('#007AFF', 0.05) },
                          borderBottom:
                            i < suggestions.length - 1
                              ? `1px solid ${alpha('#8E8E93', 0.1)}`
                              : 'none',
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => typeof sug !== 'string' && handleSuggestionClick(sug)}
                      >
                        <Typography variant="body2" fontWeight={400}>
                          {typeof sug === 'string' ? sug : sug.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Results */}
            <Box
              sx={{
                overflowY: 'auto',
                flex: 1,
                px: 3,
                pb: 3,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {renderContent()}
            </Box>
          </>
        ) : (
          selectedPlace && <SearchResult place={selectedPlace} onBack={handleBackToSearch} />
        )}
      </Box>
    </Drawer>
  );
}

// Updated PlaceCard component with iOS styling
const PlaceCard = ({
  place,
  onPlaceClick,
}: {
  place: GooglePlace;
  onPlaceClick: (place: GooglePlace) => void;
}) => {
  const category = categories.find((c) => place.types?.includes(c.type));

  return (
    <Box
      sx={{
        mb: 2,
        p: 3,
        cursor: 'pointer',
        bgcolor: 'white',
        borderRadius: 2,
        border: `1px solid ${alpha('#ED1D24', 0.1)}`,
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: alpha('#ED1D24', 0.02),
          borderColor: alpha('#ED1D24', 0.2),
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0px)',
        },
      }}
      onClick={() => onPlaceClick(place)}
    >
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: alpha('#ED1D24', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {React.cloneElement(category?.icon || <LocationOnIcon />, {
            sx: { fontSize: 20, color: '#ED1D24' },
          })}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              mb: 0.5,
              color: 'text.primary',
              lineHeight: 1.3,
            }}
          >
            {place.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              lineHeight: 1.4,
            }}
          >
            {place.vicinity || 'No address available'}
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            {place.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 16, color: '#FF9500' }} />
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ color: 'text.primary', fontSize: '0.875rem' }}
                >
                  {place.rating.toFixed(1)}
                </Typography>
              </Box>
            )}

            {place.price_level && (
              <Typography
                variant="body2"
                sx={{
                  color: '#34C759',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {Array(place.price_level).fill('$').join('')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
