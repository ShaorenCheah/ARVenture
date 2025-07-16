'use client';

import { Box, CircularProgress, Container, Stack, Typography, Divider, Chip } from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  fetchUserActivityData,
  CollectedItem,
  RedeemedItem,
  UserActivityStats,
} from '../services/userActivityHistoryServices';

export default function AdminUserActivityPage() {
  const { id: userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserActivityStats | null>(null);
  const [collected, setCollected] = useState<CollectedItem[]>([]);
  const [redeemed, setRedeemed] = useState<RedeemedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || typeof userId !== 'string') {
      return;
    }

    async function load() {
      try {
        const result = await fetchUserActivityData(userId as string);
        setStats(result.stats);
        setCollected(result.collected);
        setRedeemed(result.redeemed);
      } catch (err: unknown) {
        console.error('Failed to fetch user activity:', err);
        setError('Permission denied or user does not exist.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <CircularProgress />
        <Typography mt={2}>Loading user activity...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        User Activity Log
      </Typography>

      <Box mb={3}>
        <Typography>Total Collected: {stats?.totalCollected || 0}</Typography>
        <Typography>
          Last Collected At: {stats?.lastCollectedAt?.toLocaleString() || '—'}
        </Typography>
        <Typography>Total Redeemed: {stats?.totalRedeemed || 0}</Typography>
        <Typography>Last Redeemed At: {stats?.lastRedeemedAt?.toLocaleString() || '—'}</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Collected Items
      </Typography>
      {collected.length === 0 ? (
        <Typography color="text.secondary" mb={2}>
          No collected items.
        </Typography>
      ) : (
        <Stack spacing={2} mb={4}>
          {collected.map((item, idx) => (
            <Box key={idx} p={2} border={1} borderColor="divider" borderRadius={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight="bold">{item.title}</Typography>
                <Typography variant="body2">{item.collectedAt.toLocaleString()}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              {item.redemptionCode && (
                <Chip label={`Code: ${item.redemptionCode}`} size="small" sx={{ mt: 1 }} />
              )}
            </Box>
          ))}
        </Stack>
      )}

      <Typography variant="h6" gutterBottom>
        Redemption History
      </Typography>
      {redeemed.length === 0 ? (
        <Typography color="text.secondary">No redemptions made.</Typography>
      ) : (
        <Stack spacing={2}>
          {redeemed.map((item, idx) => (
            <Box key={idx} p={2} border={1} borderColor="divider" borderRadius={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight="bold">{item.title}</Typography>
                <Typography variant="body2">
                  {item.redeemedAt
                    ? `Redeemed: ${item.redeemedAt.toLocaleString()}`
                    : `Claimed: ${item.claimedAt.toLocaleString()}`}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} mt={1}>
                {item.code && <Chip label={`Code: ${item.code}`} size="small" />}
                <Chip
                  label={item.status === 'fulfilled' ? 'Fulfilled' : 'Pending'}
                  size="small"
                  color={item.status === 'fulfilled' ? 'success' : 'warning'}
                />
                {item.redeemedBy && (
                  <Chip label={`By: ${item.redeemedBy}`} size="small" variant="outlined" />
                )}
              </Stack>

              {item.spotName && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Location: {item.spotName}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
}
