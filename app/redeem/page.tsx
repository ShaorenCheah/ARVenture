'use client';

import InventoryIcon from '@mui/icons-material/Inventory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LoginIcon from '@mui/icons-material/Login';
import RedeemIcon from '@mui/icons-material/Redeem';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Skeleton,
  Container,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { fetchRedemptionItems, RedemptionItem } from './services/redemptionService';
import { useUserModal } from '../components/providers/UserModalContext';

const ItemImage = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: '#FFD700',
  borderRadius: 8,
  [theme.breakpoints.up('sm')]: {
    width: 80,
    height: 80,
  },
}));

const RedeemButton = styled(Button)(() => ({
  borderRadius: 20,
  fontWeight: 'bold',
  fontSize: '0.875rem',
  minWidth: 140,
  height: 36,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
  '&:disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
  },
}));

const StockChip = styled(Chip)<{ available: boolean }>(({ available }) => ({
  backgroundColor: available ? '#e8f5e8' : '#ffeaea',
  color: available ? '#2e7d32' : '#d32f2f',
  fontWeight: '600',
  fontSize: '0.75rem',
  height: 20,
  '& .MuiChip-label': {
    padding: '0 6px',
  },
  '& .MuiChip-icon': {
    fontSize: 14,
    marginLeft: 4,
  },
}));

const StatusChip = styled(Chip)(() => ({
  height: 20,
  fontSize: '0.75rem',
  fontWeight: '500',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
}));

const CriteriaBox = styled(Box)(() => ({
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  padding: '12px',
  marginTop: 12,
  border: '1px solid #e9ecef',
}));

const ResponsiveContainer = styled(Container)(({ theme }) => ({
  padding: 0,
  maxWidth: '100%',
  [theme.breakpoints.up('sm')]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: 800,
  },
}));

export default function RedemptionPage() {
  const [items, setItems] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);
  const { setOpenUserModal } = useUserModal();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserUid(user.uid);
        const data = await fetchRedemptionItems(user.uid);
        setItems(data);
      } else {
        setUserUid(null);
        const data = await fetchRedemptionItems(); // fetch anonymously
        setItems(data);
      }
      setIsLoading(false);
    });
    console.log('items', items);
    return () => unsubscribe();
  }, [items]);

  const handleRedeem = async (itemId: string, itemTitle: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error('Please log in to redeem this item.');
      setOpenUserModal(true);
      return;
    }

    try {
      toast.success(`Successfully redeemed: ${itemTitle}!`);
      const updatedItems = await fetchRedemptionItems(user.uid);
      setItems(updatedItems);
    } catch {
      toast.error('Failed to redeem item. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
            </CardContent>
          </Card>
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      {/* Redemption Items Container */}
      <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0', mb: 2 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              mb: 2,
            }}
          >
            Redeem Incentives
          </Typography>
          <Box
            sx={{
              maxHeight: { xs: '450px', sm: '680px' }, // Approximate height for 2 items
              overflowY: 'hidden',
              '&:hover': {
                overflowY: 'auto',
              },
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#c1c1c1',
                borderRadius: '3px',
                '&:hover': {
                  background: '#a8a8a8',
                },
              },
            }}
          >
            <Stack spacing={2}>
              {items.map((item) => {
                const isDisabled = userUid ? !item.hasCollected || item.remaining <= 0 : false;
                const isOutOfStock = item.remaining <= 0;
                const hasNotCollected = !item.hasCollected;

                return (
                  <Card
                    key={item.id}
                    sx={{
                      borderRadius: 2,
                      boxShadow: 'none',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#fafafa',
                      overflow: 'visible',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                      {/* Item Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <ItemImage src={item.imageURL} variant="rounded">
                          {!item.imageURL && <RedeemIcon sx={{ fontSize: 32, color: '#fff' }} />}
                        </ItemImage>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              color: '#333',
                              fontSize: { xs: '1rem', sm: '1.25rem' },
                              mb: 1,
                              lineHeight: 1.2,
                            }}
                          >
                            {item.title}
                          </Typography>

                          {/* Status Chips */}
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            <StockChip
                              available={item.remaining > 0}
                              icon={<InventoryIcon />}
                              label={`${item.remaining} left`}
                              size="small"
                            />

                            {hasNotCollected && (
                              <StatusChip
                                label="Collectible required"
                                size="small"
                                sx={{ backgroundColor: '#fff3cd', color: '#856404' }}
                              />
                            )}

                            {isOutOfStock && item.hasCollected && (
                              <StatusChip
                                label="Out of stock"
                                size="small"
                                sx={{ backgroundColor: '#f8d7da', color: '#721c24' }}
                              />
                            )}
                          </Stack>
                        </Box>
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          mb: 2,
                          lineHeight: 1.5,
                          fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        }}
                      >
                        {item.description}
                      </Typography>

                      {/* Criteria Box */}
                      <CriteriaBox>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 'bold',
                              color: '#333',
                              fontSize: '0.8rem',
                            }}
                          >
                            Criteria:
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#666',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            lineHeight: 1.4,
                          }}
                        >
                          To redeem your gift, you must collect the AR item at{' '}
                          <strong>{item.requiredSpotName}</strong>.
                        </Typography>
                      </CriteriaBox>

                      {/* Redeem Button */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <RedeemButton
                          variant="contained"
                          color="error"
                          startIcon={!userUid ? <LoginIcon /> : <RedeemIcon />}
                          onClick={() => handleRedeem(item.id, item.title)}
                          disabled={!!userUid && isDisabled}
                          sx={{
                            backgroundColor: !userUid
                              ? '#dc3545'
                              : isDisabled
                                ? '#e0e0e0'
                                : '#dc3545',
                            '&:hover': {
                              backgroundColor: !userUid
                                ? '#c82333'
                                : isDisabled
                                  ? '#e0e0e0'
                                  : '#c82333',
                            },
                          }}
                        >
                          {!userUid ? 'LOGIN TO REDEEM' : isDisabled ? 'Unavailable' : 'REDEEM'}
                        </RedeemButton>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              mb: 2,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Terms and Conditions
          </Typography>
          <Stack component="ol" spacing={1} sx={{ color: '#666', lineHeight: 1.6, pl: 2 }}>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              To be eligible for redemption, users must have collected the required collectibles or
              meet the specified criteria within the event.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              Upon clicking the redeem button, a unique code will be displayed for the gift. This
              code must be presented at the redemption point.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              Each user can only redeem one gift per event cycle. Multiple attempts will not be
              allowed.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              Gift quantities are limited and subject to availability. Redemption will close once
              all gifts have been claimed.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              The redemption period is limited to the event duration. Once the event ends, the
              redemption process will no longer be available.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              Gifts cannot be exchanged for cash or any other form of compensation.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              The event organizers reserve the right to modify or cancel the redemption process any
              time without prior notice.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
            >
              The delivery or collection of gifts may be subject to location and availability.
              Please follow the instructions provided with the redemption code for gift collection
              details.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
}
