'use client';

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
  Rating,
  Button,
  CircularProgress,
  Link,
  Avatar,
  Divider,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { fetchPlaceDetails, getPhotoUrl } from './searchService';
import type { GooglePlace, GooglePlaceDetails } from './searchService';

interface SearchResultProps {
  place: GooglePlace;
  onBack: () => void;
}

export default function SearchResult({ place, onBack }: SearchResultProps) {
  const [details, setDetails] = useState<GooglePlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<boolean[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await fetchPlaceDetails(place.place_id);
      setDetails(result);
      setExpandedReviews(new Array(result?.reviews?.length || 0).fill(false));
      setLoading(false);
    };
    load();
  }, [place]);

  if (loading || !details) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  const photos = details.photos || [];
  const reviews = details.reviews || [];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
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
        <Typography variant="h4" fontWeight="bold">
          Place Details
        </Typography>
      </Box>

      {/* Body Scroll */}
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        {/* Gallery */}
        {photos.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 2 }}>
            {photos.map((p, idx) => (
              <Box
                component="img"
                key={idx}
                src={getPhotoUrl(p.photo_reference, 600)}
                alt={`Photo ${idx + 1}`}
                sx={{
                  height: 200,
                  width: 300,
                  objectFit: 'cover',
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
        )}

        {/* Basic Info */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {details.name}
          </Typography>

          {details.rating && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Rating value={details.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {details.rating.toFixed(1)} / 5
              </Typography>
            </Box>
          )}

          {details.opening_hours?.open_now !== undefined && (
            <Typography
              variant="body2"
              color={details.opening_hours.open_now ? 'success.main' : 'error.main'}
              fontWeight="bold"
              mt={0.5}
            >
              {details.opening_hours.open_now ? 'Open Now' : 'Closed Now'}
            </Typography>
          )}

          {details.price_level && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Price Level: {'💲'.repeat(details.price_level)}
            </Typography>
          )}
        </Card>

        {/* Contact & Hours */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Contact & Location
          </Typography>

          {details.formatted_address && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2">{details.formatted_address}</Typography>
            </Box>
          )}

          {details.formatted_phone_number && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color="primary">
                {details.formatted_phone_number}
              </Typography>
            </Box>
          )}

          {details.website && (
            <Box display="flex" alignItems="center" gap={1}>
              <WebIcon fontSize="small" color="action" />
              <Link href={details.website} target="_blank" rel="noopener" variant="body2">
                Visit Website
              </Link>
            </Box>
          )}

          {details.opening_hours?.weekday_text && (
            <Box display="flex" alignItems="flex-start" gap={1} mt={1}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Hours:
                </Typography>
                {details.opening_hours.weekday_text.map((line, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    {line}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Card>

        {/* Reviews */}
        {reviews.length > 0 && (
          <Card sx={{ p: 2, mb: 2, maxHeight: 300, overflowY: 'auto' }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Reviews
            </Typography>

            {reviews.map((r, i) => {
              const isExpanded = expandedReviews[i];
              const maxLength = 150;
              const isLong = r.text.length > maxLength;

              return (
                <Box key={i} mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={r.profile_photo_url}
                      alt={r.author_name}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {r.author_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.relative_time_description}
                      </Typography>
                    </Box>
                  </Box>

                  <Rating value={r.rating} precision={0.5} readOnly size="small" sx={{ mt: 0.5 }} />

                  <Box
                    sx={{
                      mt: 0.5,
                      maxHeight: isExpanded ? 'none' : 60,
                      overflowY: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Typography variant="body2">
                      {isExpanded ? r.text : `${r.text.slice(0, maxLength)}${isLong ? '...' : ''}`}
                    </Typography>
                  </Box>

                  {isLong && (
                    <Button
                      size="small"
                      onClick={() =>
                        setExpandedReviews((prev) => {
                          const updated = [...prev];
                          updated[i] = !updated[i];
                          return updated;
                        })
                      }
                      sx={{ mt: 1, textTransform: 'none', p: 0 }}
                    >
                      {isExpanded ? 'View Less' : 'View More'}
                    </Button>
                  )}

                  {i < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              );
            })}
          </Card>
        )}

        {/* Google Maps Button */}
        {details.geometry?.location && (
          <Button
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
            onClick={() => {
              const { lat, lng } = details.geometry!.location;
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                '_blank'
              );
            }}
          >
            Get Directions
          </Button>
        )}
      </Box>
    </Box>
  );
}
