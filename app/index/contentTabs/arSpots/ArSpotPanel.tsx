'use client';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Divider, Stack, Skeleton, Typography, Card } from '@mui/material';
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
        borderRadius: 1,
        px: 1.5,
        py: 1,
        cursor: !isSkeleton ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      <Stack sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Title Row */}
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
          {isSkeleton ? (
            <Skeleton variant="circular" width={35} height={35} />
          ) : spot?.iconUrl ? (
            <img
              src={spot.iconUrl}
              alt={`${spot.name} icon`}
              style={{
                width: '35px',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
          ) : (
            <Box sx={{ width: 35, height: 35 }} />
          )}

          {isSkeleton ? (
            <Skeleton variant="text" width="40%" height={28} />
          ) : (
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
              {spot?.name}
            </Typography>
          )}
        </Stack>

        {/* Description */}
        {isSkeleton ? (
          <>
            <Skeleton variant="text" width="95%" height={18} />
            <Skeleton variant="text" width="90%" height={18} />
          </>
        ) : (
          <Typography
            component="div"
            variant="body2"
            sx={{
              color: '#666',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              mb: 1,
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
            justifyContent: 'end',
            width: '100%',
            mt: 1,
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: '14px', color: '#888', mr: 0.5 }} />
          {isSkeleton ? (
            <Skeleton variant="text" width={60} height={16} />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: '#888',
                overflow: 'hidden',
                WebkitLineClamp: 2,
                textAlign: 'end',
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
            <Fragment key={index}>
              {renderCardContent(undefined, true)}
              {index !== 2 && <Divider sx={{ my: 0.5 }} />}
            </Fragment>
          ))
        : spots.map((spot, index) => (
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
              {index !== spots.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </Fragment>
          ))}
    </Stack>
  );
}
