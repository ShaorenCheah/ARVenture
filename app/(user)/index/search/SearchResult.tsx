'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigationIcon from '@mui/icons-material/Navigation';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import WebIcon from '@mui/icons-material/Web';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Link,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { fetchPlaceDetails, getPhotoUrl } from './searchService';
import type { GooglePlace, GooglePlaceDetails } from './searchService';

interface SearchResultProps {
  place: GooglePlace;
  onBack: () => void;
}

export default function IOSPlaceDetails({ place, onBack }: SearchResultProps) {
  const [details, setDetails] = useState<GooglePlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<boolean[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f8f9fa"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  const photos = details.photos || [];
  const reviews = details.reviews || [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
          }}
        >
          <IconButton
            onClick={onBack}
            sx={{
              p: 1,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <ArrowBackIcon sx={{ color: '#666' }} />
          </IconButton>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
            }}
          >
            Place Details
          </Typography>
          <Box sx={{ width: 40 }} />
        </Box>
      </Box>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              aspectRatio: '4/3',
              bgcolor: '#e5e7eb',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: `${photos.length * 100}%`,
                height: '100%',
                transform: `translateX(-${activePhotoIndex * (100 / photos.length)}%)`,
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              {photos.map((photo, index) => (
                <Box
                  key={index}
                  component="img"
                  src={getPhotoUrl(photo.photo_reference, 800)}
                  alt={`Place photo ${index + 1}`}
                  sx={{
                    width: `${100 / photos.length}%`,
                    height: '100%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ))}
            </Box>

            {/* Touch/Swipe overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
              }}
            >
              {/* Left touch area */}
              <Box
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  opacity: 0,
                }}
                onClick={() => {
                  if (activePhotoIndex > 0) {
                    setActivePhotoIndex(activePhotoIndex - 1);
                  }
                }}
              />
              {/* Right touch area */}
              <Box
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  opacity: 0,
                }}
                onClick={() => {
                  if (activePhotoIndex < photos.length - 1) {
                    setActivePhotoIndex(activePhotoIndex + 1);
                  }
                }}
              />
            </Box>
          </Box>

          {/* Photo indicators */}
          {photos.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
              }}
            >
              {photos.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setActivePhotoIndex(index)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === activePhotoIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Box>
          )}

          {/* Photo counter */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <CameraAltIcon sx={{ fontSize: 16 }} />
            {photos.length}
          </Box>
        </Box>
      )}

      {/* Content */}
      <Box sx={{ p: 3, space: 3 }}>
        {/* Basic Info */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '16px',
            p: 2.5,
            mb: 3,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {details.name}
          </Typography>

          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
          >
            {/* Rating */}
            {details.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <StarIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {details.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  ({details.user_ratings_total || 0} reviews)
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Contact Information */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            mb: 3,
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #f3f4f6' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2.5,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                Information
              </Typography>

              {/* Price Level */}
              {details.price_level && (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  {'$'.repeat(details.price_level)} •{' '}
                  {details.types?.[0]
                    ?.replace(/_/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Business'}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {details.formatted_address && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOnIcon sx={{ color: '#9ca3af', mt: 0.5, fontSize: 20 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {details.formatted_address}
                  </Typography>
                </Box>
              )}

              {details.formatted_phone_number && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  <Link
                    variant="body1"
                    href={`tel:${details.formatted_phone_number}`}
                    sx={{
                      color: 'brand.main',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {details.formatted_phone_number}
                  </Link>
                </Box>
              )}

              {details.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WebIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  <Link
                    variant="body1"
                    href={details.website}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      color: 'brand.main',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Visit Website
                  </Link>
                </Box>
              )}
            </Box>
          </Box>

          {/* Hours */}
          {details.opening_hours?.weekday_text && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
                  <Typography variant="h4" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                    Opening Hours
                  </Typography>
                </Box>

                {/* Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {details.opening_hours?.open_now !== undefined && (
                    <Chip
                      label={details.opening_hours.open_now ? 'Open Now' : 'Closed'}
                      sx={{
                        bgcolor: details.opening_hours.open_now ? '#dcfce7' : '#fef2f2',
                        color: details.opening_hours.open_now ? '#166534' : '#dc2626',
                        fontWeight: 500,
                        fontSize: '12px',
                        '& .MuiChip-label': { px: 1.5, py: 0.25 },
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {details.opening_hours.weekday_text.map((hour, index) => {
                  const [day, ...timeParts] = hour.split(':');
                  const timeRange = timeParts.join(':').trim();
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {day}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {timeRange}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>

        {/* Reviews */}
        {reviews.length > 0 && (
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              p: 3,
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              Reviews
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {reviews.map((review, index) => (
                <Box
                  key={index}
                  sx={{
                    borderBottom: index < reviews.length - 1 ? '1px solid #f3f4f6' : 'none',
                    pb: index < reviews.length - 1 ? 2 : 0,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {review.author_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                          {review.relative_time_description}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{
                              fontSize: 16,
                              color: i < review.rating ? '#fbbf24' : '#d1d5db',
                            }}
                          />
                        ))}
                      </Box>

                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {expandedReviews[index] || review.text.length <= 150
                          ? review.text
                          : `${review.text.slice(0, 150)}...`}
                      </Typography>

                      {review.text.length > 150 && (
                        <Button
                          onClick={() =>
                            setExpandedReviews((prev) => {
                              const updated = [...prev];
                              updated[index] = !updated[index];
                              return updated;
                            })
                          }
                          sx={{
                            color: 'brand.main',
                            fontWeight: 500,
                            textTransform: 'none',
                            p: 0,
                            mt: 1,
                            fontSize: '12px',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                          }}
                        >
                          {expandedReviews[index] ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Get Directions Button */}
        {details.geometry?.location && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              const { lat, lng } = details.geometry!.location;
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                '_blank'
              );
            }}
            sx={{
              bgcolor: 'brand.main',
              color: 'white',
              py: 1.5,
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '16px',
              textTransform: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'brand.accent',
                boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.15)',
              },
            }}
            startIcon={<NavigationIcon />}
          >
            Get Directions
          </Button>
        )}
      </Box>
    </Box>
  );
}
