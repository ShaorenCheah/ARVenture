'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  Card,
  Divider,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Rating,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { fetchPlaces, fetchSuggestions } from './searchService';
import SearchResult from './SearchResult';

const categories = [
  { label: 'Food', id: '13065', icon: '🍽️' },
  { label: 'Attractions', id: '16000', icon: '🎡' },
  { label: 'Shopping', id: '17069', icon: '🛍️' },
  { label: 'Cafes', id: '13032', icon: '☕' },
  { label: 'Parks', id: '16032', icon: '🌳' },
  { label: 'Entertainment', id: '10000', icon: '🎬' },
  { label: 'Fitness', id: '18000', icon: '🏋️' },
  { label: 'Nightlife', id: '10032', icon: '🌙' },
];

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ open, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'search' | 'result'>('search');

  // Autocomplete states
  type Suggestion = string | { name: string; rating?: number };
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query && !selectedCat) {
        setResults([]); // clear results when everything is reset
        return;
      }

      fetchPlaces(query, selectedCat).then(setResults);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, selectedCat]);

  const validResults = results.filter(
    (place: any) => place?.location?.formatted_address || place?.location?.address
  );

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion); // Update state
    if (inputRef.current) {
      inputRef.current.value = suggestion; // Force update input text
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

  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place);
    setCurrentView('result');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedPlace(null);
  };

  // Reset view when drawer closes
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
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          pt: 2,
        }}
      >
        {currentView === 'search' ? (
          <>
            {/* Sticky Search Header */}
            <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">Search Nearby</Typography>
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Category Chips */}
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
                    key={cat.id}
                    label={`${cat.icon} ${cat.label}`}
                    clickable
                    color={selectedCat === cat.id ? 'primary' : 'default'}
                    onClick={() => setSelectedCat((prev) => (prev === cat.id ? '' : cat.id))}
                  />
                ))}
              </Box>

              {/* Search Input */}
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
                    fetchSuggestions(val, selectedCat).then(setSuggestions);
                  } else {
                    setSuggestions([]);
                  }
                }}
                onBlur={(e) => {
                  // Only hide suggestions if we're not clicking on a suggestion
                  // Use setTimeout to allow click events to fire first
                  setTimeout(() => {
                    setShowSuggestions(false);
                  }, 150);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
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
                sx={{ mb: 2 }}
              />

              {/* Suggestions Dropdown */}
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
                      onMouseDown={(e) => {
                        // Prevent the blur event from firing when clicking suggestion
                        e.preventDefault();
                      }}
                      onClick={() =>
                        handleSuggestionClick(typeof sug === 'string' ? sug : sug.name)
                      }
                    >
                      {typeof sug === 'string' ? (
                        sug
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography>{sug.name}</Typography>
                          {sug.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Rating
                                value={sug.rating}
                                max={10}
                                precision={0.1}
                                readOnly
                                size="small"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {sug.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              <Divider />
            </Box>

            {/* Search Results */}
            <Box sx={{ overflowY: 'auto', flex: 1, pt: 2 }}>
              {results.length === 0 && !query && !selectedCat ? (
                <Box textAlign="center" mt={5}>
                  <Typography variant="body2" color="text.secondary">
                    Start exploring by typing or selecting a category 🧭
                  </Typography>
                </Box>
              ) : validResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={5}>
                  No results found.
                </Typography>
              ) : (
                validResults.map((place: any) => {
                  const category = categories.find((c) =>
                    place.categories?.some((cat: any) => cat.id === c.id)
                  );

                  return (
                    <Card
                      key={place.fsq_id}
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
                              max={10}
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
                        {place.location?.formatted_address || place.location?.address}
                      </Typography>

                      {place.price && (
                        <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                          Price: {Array(place.price).fill('💲').join('')}
                        </Typography>
                      )}
                    </Card>
                  );
                })
              )}
            </Box>
          </>
        ) : (
          <SearchResult place={selectedPlace} onBack={handleBackToSearch} />
        )}
      </Box>
    </Drawer>
  );
}
