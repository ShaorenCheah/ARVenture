import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WebIcon from '@mui/icons-material/Web';
import {
  Box,
  Typography,
  IconButton,
  Card,
  Chip,
  Divider,
  Avatar,
  Rating,
  Button,
  Link,
  CircularProgress,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { fetchPlaceDetails, fetchPlacePhotos, fetchPlaceTips } from './searchService';

interface SearchResultProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  place: any;
  onBack: () => void;
}

export default function SearchResult({ place, onBack }: SearchResultProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [details, setDetails] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [photos, setPhotos] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaceData = async () => {
      setLoading(true);
      try {
        const [placeDetails, placePhotos, placeTips] = await Promise.all([
          fetchPlaceDetails(place.fsq_id),
          fetchPlacePhotos(place.fsq_id),
          fetchPlaceTips(place.fsq_id),
        ]);

        setDetails(placeDetails);
        setPhotos(placePhotos);
        setTips(placeTips);
      } catch (error) {
        console.error('Error loading place data:', error);
      }
      setLoading(false);
    };

    if (place?.fsq_id) {
      loadPlaceData();
    }
  }, [place]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const currentPlace = details || place;
  const category = currentPlace.categories?.[0];
  const address = currentPlace.location?.formatted_address || currentPlace.location?.address;
  const iconUrl = category?.icon ? `${category.icon.prefix}64${category.icon.suffix}` : null;

  const fallbackText = (value: string | undefined | null, fallback: string) =>
    value && value.trim() !== '' ? value : fallback;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Back Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 1,
          pb: 1,
        }}
      >
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={'bold'} sx={{ flexGrow: 1 }}>
          Place Details
        </Typography>
        {category && <Chip label={category.name} size="small" color="primary" variant="outlined" />}
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* Main Info Card */}
        <Card
          sx={{
            p: 1.5,
            mb: 2,
            maxHeight: 300,
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              {iconUrl ? (
                <Box
                  component="img"
                  src={iconUrl}
                  alt={category?.name || 'Category'}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                '📍'
              )}
            </Avatar>
            <Box
              sx={{
                flex: 1,
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {currentPlace.name}
              </Typography>

              {currentPlace.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={currentPlace.rating / 2} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                    {currentPlace.rating.toFixed(1)} / 10
                  </Typography>
                </Box>
              )}

              {currentPlace.price && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Price Level: {Array(currentPlace.price).fill('$').join('')}
                </Typography>
              )}
            </Box>
          </Box>

          {currentPlace.description && (
            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
              {fallbackText(currentPlace.description, 'No description available')}
            </Typography>
          )}
        </Card>

        {/* Contact Information */}
        <Card
          sx={{
            p: 1.5,
            mb: 2,
            maxHeight: 300,
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Contact & Location
          </Typography>

          {address && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
              <Typography variant="body2">{fallbackText(address, 'Address available')}</Typography>
            </Box>
          )}

          {currentPlace.tel && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color="primary.main">
                {fallbackText(currentPlace.tel, 'Telephone number unavailable')}
              </Typography>
            </Box>
          )}

          {currentPlace.website && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WebIcon fontSize="small" color="action" />
              <Link href={currentPlace.website} target="_blank" variant="body2">
                Visit Website
              </Link>
            </Box>
          )}

          {currentPlace.hours && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <AccessTimeIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Hours:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentPlace.hours?.display?.trim()
                    ? currentPlace.hours.display
                    : 'Working hours unavailable'}
                </Typography>
              </Box>
            </Box>
          )}
        </Card>

        {/* Photos */}
        {photos && photos.length > 0 && (
          <Card
            sx={{
              p: 1.5,
              mb: 2,
              maxHeight: 300,
              overflowY: 'auto',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              Photos
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {photos.slice(0, 10).map((photo, index) => (
                <Box
                  key={index}
                  component="img"
                  src={`${photo.prefix}300x200${photo.suffix}`}
                  alt={`${currentPlace.name} photo ${index + 1}`}
                  sx={{
                    width: 150,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
              ))}
            </Box>
          </Card>
        )}

        {/* Tips/Reviews */}
        <Card
          sx={{
            p: 1.5,
            mb: 2,
            pb: 0,
            maxHeight: 300,
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Tips & Reviews
          </Typography>

          {tips && tips.length > 0 ? (
            tips.slice(0, 10).map((tip, index, arr) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  &quot;{tip.text}&quot;
                </Typography>
                <Box
                  width="100%"
                  sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    - {tip.user?.first_name || 'Anonymous'} •{' '}
                    {new Date(tip.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                {index < arr.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No reviews available.
            </Typography>
          )}
        </Card>
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {currentPlace.location?.latitude && currentPlace.location?.longitude && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${currentPlace.location.latitude},${currentPlace.location.longitude}`;
                window.open(url, '_blank');
              }}
            >
              Get Directions
            </Button>
          )}

          {currentPlace.website && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => window.open(currentPlace.website, '_blank')}
            >
              Visit Website
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
