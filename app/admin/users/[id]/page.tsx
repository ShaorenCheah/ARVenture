'use client';

import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="40vh"
        >
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body1" color="text.secondary" mt={3}>
            Loading user activity...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="40vh">
          <Typography variant="h6" color="error" textAlign="center">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600} color="text.primary" gutterBottom>
          User Activity
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of collected items and redemption history
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={6}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
              },
              height: '100%',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
                {stats?.totalCollected || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Total Collected
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'secondary.main',
                transform: 'translateY(-2px)',
              },
              height: '100%',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h3" fontWeight={700} color="secondary.main" gutterBottom>
                {stats?.totalRedeemed || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Total Redeemed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'success.main',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                Last Collected
              </Typography>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {stats?.lastCollectedAt?.toLocaleDateString() || '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats?.lastCollectedAt?.toLocaleTimeString() || ''}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'warning.main',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                Last Redeemed
              </Typography>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {stats?.lastRedeemedAt?.toLocaleDateString() || '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats?.lastRedeemedAt?.toLocaleTimeString() || ''}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Collected Items Section */}
      <Box mb={6}>
        <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
          Collected Items
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          {collected.length} items collected
        </Typography>

        {collected.length === 0 ? (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'grey.50',
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No items collected yet
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {collected.map((item, idx) => (
              <Card
                key={idx}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ whiteSpace: 'nowrap', ml: 2 }}
                    >
                      {item.collectedAt.toLocaleDateString()}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" mb={2} lineHeight={1.6}>
                    {item.description}
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {item.collectedAt.toLocaleTimeString()}
                    </Typography>
                    {item.redemptionCode && (
                      <Chip
                        label={`Code: ${item.redemptionCode}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Redemption History Section */}
      <Box>
        <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
          Redemption History
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          {redeemed.length} redemptions made
        </Typography>

        {redeemed.length === 0 ? (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'grey.50',
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No redemptions made yet
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {redeemed.map((item, idx) => (
              <Card
                key={idx}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    backgroundColor: 'secondary.50',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ whiteSpace: 'nowrap', ml: 2 }}
                    >
                      {item.redeemedAt
                        ? item.redeemedAt.toLocaleDateString()
                        : item.claimedAt.toLocaleDateString()}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} flexWrap="wrap" gap={1} mb={2}>
                    {item.code && (
                      <Chip
                        label={`Code: ${item.code}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                    <Chip
                      label={item.status === 'fulfilled' ? 'Fulfilled' : 'Pending'}
                      size="small"
                      color={item.status === 'fulfilled' ? 'success' : 'warning'}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                    {item.redeemedBy && (
                      <Chip
                        label={`Redeemed by: ${item.redeemedBy}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {item.spotName && (
                      <Typography variant="body2" color="text.secondary">
                        {item.spotName}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {item.redeemedAt
                        ? `Redeemed: ${item.redeemedAt.toLocaleTimeString()}`
                        : `Claimed: ${item.claimedAt.toLocaleTimeString()}`}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
}
