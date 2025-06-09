import React, { useState, useEffect } from 'react';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WebIcon from '@mui/icons-material/Web';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhotoIcon from '@mui/icons-material/Photo';
import { fetchPlaceDetails, fetchPlacePhotos, fetchPlaceTips } from './searchService';

interface SearchResultProps {
  place: any;
  onBack: () => void;
}

export default function SearchResult({ place, onBack }: SearchResultProps) {
  const [details, setDetails] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Back Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Place Details
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Main Info Card */}
        <Card sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
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
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {currentPlace.name}
              </Typography>

              {currentPlace.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={currentPlace.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {currentPlace.rating.toFixed(1)} / 10
                  </Typography>
                </Box>
              )}

              {category && (
                <Chip
                  label={category.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              )}

              {currentPlace.price && (
                <Typography variant="body2" color="text.secondary">
                  Price Level: {Array(currentPlace.price).fill('$').join('')}
                </Typography>
              )}
            </Box>
          </Box>

          {currentPlace.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {currentPlace.description}
            </Typography>
          )}
        </Card>

        {/* Contact Information */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" />
            Contact & Location
          </Typography>

          {address && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
              <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
              <Typography variant="body2">{address}</Typography>
            </Box>
          )}

          {currentPlace.tel && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Link href={`tel:${currentPlace.tel}`} variant="body2">
                {currentPlace.tel}
              </Link>
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
                {currentPlace.hours.display && (
                  <Typography variant="body2" color="text.secondary">
                    {currentPlace.hours.display}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Card>

        {/* Photos */}
        {photos && photos.length > 0 && (
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhotoIcon fontSize="small" />
              Photos
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {photos.slice(0, 5).map((photo, index) => (
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
        {tips && tips.length > 0 && (
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tips & Reviews
            </Typography>
            {tips.slice(0, 3).map((tip, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  "{tip.text}"
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  - {tip.user?.first_name || 'Anonymous'} •{' '}
                  {new Date(tip.created_at).toLocaleDateString()}
                </Typography>
                {index < tips.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Card>
        )}

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
