'use client';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Stack, Skeleton, Typography, Card } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';

import { fetchArSpots, ArSpot } from './arSpotService';

interface Props {
  onSpotClick: (spot: {
    title: string;
    description: string;
    imageUrl: string;
    address?: string;
    collectibleTips?: string;
    arURL?: string;
  }) => void;
}

export default function ArSpotPanel({ onSpotClick }: Props) {
  const [spots, setSpots] = useState<ArSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArSpots()
      .then(setSpots)
      .finally(() => setLoading(false));
  }, []);

  const renderCardContent = (spot?: ArSpot, isSkeleton = false) => (
    <Card
      sx={{
        borderRadius: 2,
        px: 2,
        py: 1.5,
        cursor: !isSkeleton ? 'pointer' : 'default',
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: '#ffffff',
        boxShadow: 'none',
        transition: 'all 0.15s ease',
        '&:hover': !isSkeleton
          ? {
              borderColor: 'rgba(0, 0, 0, 0.12)',
              backgroundColor: 'rgba(0, 0, 0, 0.01)',
            }
          : {},
        '&:active': !isSkeleton
          ? {
              borderColor: 'rgba(0, 0, 0, 0.16)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              transform: 'scale(0.995)',
            }
          : {},
      }}
    >
      <Stack sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Title Row */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 1.5, width: '100%' }}>
          {isSkeleton ? (
            <Skeleton variant="circular" width={36} height={36} />
          ) : spot?.iconUrl ? (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                overflow: 'hidden',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={spot.iconUrl}
                alt={`${spot.name} icon`}
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain',
                }}
              />
            </Box>
          ) : (
            <Box sx={{ width: 36, height: 36 }} />
          )}

          {isSkeleton ? (
            <Skeleton variant="text" width="40%" height={24} />
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                lineHeight: 1.2,
              }}
            >
              {spot?.name}
            </Typography>
          )}
        </Stack>

        {/* Description */}
        {isSkeleton ? (
          <Stack sx={{ width: '100%', gap: 0.5, mb: 1.5 }}>
            <Skeleton variant="text" width="95%" height={16} />
            <Skeleton variant="text" width="85%" height={16} />
            <Skeleton variant="text" width="75%" height={16} />
          </Stack>
        ) : (
          <Typography
            component="div"
            variant="body2"
            sx={{
              color: '#666666', // Softer gray
              lineHeight: 1.4,
              fontSize: '14px',
              mb: 1.5,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
            }}
          >
            {spot?.description}
          </Typography>
        )}

        {/* View More */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            opacity: 0.7,
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: '12px', color: '#999999', mr: 0.5 }} />
          {isSkeleton ? (
            <Skeleton variant="text" width={60} height={14} />
          ) : (
            <Typography
              variant="caption"
              sx={{
                color: '#999999',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.2px',
              }}
            >
              View More
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Stack spacing={2}>
      {loading
        ? [...Array(3)].map((_, index) => (
            <Fragment key={index}>{renderCardContent(undefined, true)}</Fragment>
          ))
        : spots.map((spot) => (
            <Fragment key={spot.id}>
              <Box
                onClick={() =>
                  onSpotClick({
                    title: spot.name,
                    description: spot.description ?? 'No description available.',
                    imageUrl: spot.imageUrl,
                    address: spot.address ?? 'Default address',
                    collectibleTips: spot.collectibleTips ?? 'Clue not available.',
                    arURL: spot.arURL ?? '',
                  })
                }
              >
                {renderCardContent(spot, false)}
              </Box>
            </Fragment>
          ))}
    </Stack>
  );
}
