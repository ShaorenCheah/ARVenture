'use client';

import AttractionsIcon from '@mui/icons-material/Attractions';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import MovieIcon from '@mui/icons-material/Movie';
import MuseumIcon from '@mui/icons-material/Museum';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import ParkIcon from '@mui/icons-material/Park';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TempleBuddhistIcon from '@mui/icons-material/TempleBuddhist';
import WaterIcon from '@mui/icons-material/Water';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  Card,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Rating,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

import SearchResult from './SearchResult';
import { fetchPlaces, fetchSuggestions } from './searchService';

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

export default function SearchDrawer({ open, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [results, setResults] = useState<GooglePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);
  const [currentView, setCurrentView] = useState<'search' | 'result'>('search');

  type Suggestion = string | { name: string; place_id: string };
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query && !selectedCat) {
        setResults([]);
        return;
      }

      fetchPlaces(query, selectedCat).then((res) => {
        const filtered = res.filter((place) =>
          place.vicinity?.toLowerCase().includes('bandar sunway')
        );
        setResults(filtered);
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, selectedCat]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.value = suggestion;
    }

    setShowSuggestions(false);
    setSuggestions([]);

    fetchPlaces(suggestion, selectedCat).then(setResults);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSelectedCat('');
    setSuggestions([]);
    setShowSuggestions(false);
    setResults([]);
  };

  const handlePlaceClick = (place: GooglePlace) => {
    setSelectedPlace(place);
    setCurrentView('result');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedPlace(null);
  };

  useEffect(() => {
    if (!open) {
      setCurrentView('search');
      setSelectedPlace(null);
    }
  }, [open]);

  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '100vh',
          borderRadius: { xs: 0, md: 3 },
          bgcolor: 'background.paper',
          maxWidth: isDesktop ? '600px' : '100%',
          mx: 'auto',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', px: 2, pt: 2 }}>
        {currentView === 'search' ? (
          <>
            <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h4" fontWeight="bold">
                  Search Nearby
                </Typography>
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 1,
                  mb: 2,
                  pb: 1,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {categories.map((cat) => (
                  <Chip
                    key={cat.type}
                    label={
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {cat.icon}
                        <span>{cat.label}</span>
                      </Box>
                    }
                    clickable
                    color={selectedCat === cat.type ? 'primary' : 'default'}
                    onClick={() => setSelectedCat((prev) => (prev === cat.type ? '' : cat.type))}
                  />
                ))}
              </Box>

              <TextField
                inputRef={inputRef}
                fullWidth
                placeholder="Search restaurants, landmarks, etc..."
                value={query}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery(val);
                  setShowSuggestions(true);

                  if (val.trim()) {
                    fetchSuggestions(val).then(setSuggestions);
                  } else {
                    setSuggestions([]);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                InputProps={{
                  endAdornment: (query || selectedCat) && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClearSearch}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '1.5px',
                    },
                  },
                }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    bgcolor: 'white',
                    zIndex: 10,
                    boxShadow: 2,
                    borderRadius: 1,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {suggestions.map((sug, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#f5f5f5' },
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        handleSuggestionClick(typeof sug === 'string' ? sug : sug.name)
                      }
                    >
                      <Typography>{typeof sug === 'string' ? sug : sug.name}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                overflowY: 'auto',
                flex: 1,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                pt: 1,
                pl: 1,
                pr: 1,
                mb: 2,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {results.length === 0 && !query && !selectedCat ? (
                <Box
                  textAlign="center"
                  mt={5}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={3}
                >
                  <img src="/search.png" alt="Search Icon" width={150} />
                  <Typography variant="body1" color="text.secondary" mt={1.5}>
                    Start exploring by typing or selecting a category
                  </Typography>
                </Box>
              ) : results.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={5}>
                  No results found.
                </Typography>
              ) : (
                results.map((place) => {
                  const category = categories.find((c) => place.types?.includes(c.type));

                  return (
                    <Card
                      key={place.place_id}
                      sx={{
                        mb: 2,
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        transition: 'background-color 0.2s',
                      }}
                      onClick={() => handlePlaceClick(place)}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6">{category?.icon || '📍'}</Typography>
                        <Typography fontWeight={600} sx={{ flex: 1 }}>
                          {place.name}
                        </Typography>
                        {place.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Rating
                              value={place.rating}
                              max={5}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {place.rating.toFixed(1)}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {place.vicinity || 'No address available'}
                      </Typography>

                      {place.price_level && (
                        <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                          Price: {Array(place.price_level).fill('💲').join('')}
                        </Typography>
                      )}
                    </Card>
                  );
                })
              )}
            </Box>
          </>
        ) : (
          selectedPlace && <SearchResult place={selectedPlace} onBack={handleBackToSearch} />
        )}
      </Box>
    </Drawer>
  );
}
