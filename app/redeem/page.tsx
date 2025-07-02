'use client';

import { useEffect, useState } from 'react';
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
  Paper,
  Stack,
} from '@mui/material';
import RedeemIcon from '@mui/icons-material/Redeem';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import { styled } from '@mui/material/styles';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';
import { fetchRedemptionItems } from './services/redemptionService';
import { useUserModal } from '../components/providers/UserModalContext';

const ItemCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 20,
  marginBottom: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  overflow: 'visible',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
}));

const ItemImage = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: '#FFD700',
  border: '4px solid #fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
}));

const RedeemButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  fontWeight: 'bold',
  fontSize: '0.9rem',
  minWidth: 120,
  height: 40,
  textTransform: 'uppercase',
  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
  },
  '&:disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    boxShadow: 'none',
  },
}));

const CriteriaBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  padding: '8px 12px',
  marginTop: 8,
  border: '1px solid #e9ecef',
}));

const StockChip = styled(
  ({ available, ...props }: { available: boolean } & React.ComponentProps<typeof Chip>) => (
    <Chip {...props} />
  )
)<{ available: boolean }>(({ available }) => ({
  backgroundColor: available ? '#e8f5e8' : '#ffeaea',
  color: available ? '#2e7d32' : '#d32f2f',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  height: 24,
}));

export default function RedemptionPage() {
  const [items, setItems] = useState<any[]>([]);
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
  }, []);

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
    } catch (error) {
      toast.error('Failed to redeem item. Please try again.');
    }
  };

  // if (isLoading) {
  //   return (
  //     <>
  //       <HeaderCard>
  //         <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto' }} />
  //       </HeaderCard>
  //       {Array.from({ length: 2 }).map((_, i) => (
  //         <Skeleton key={i} variant="rectangular" height={140} sx={{ mb: 2, borderRadius: 5 }} />
  //       ))}
  //     </>
  //   );
  // }

  return (
    <Stack sx={{ width: '100%', height: '100%', gap: 2 }}>
      <Card sx={{ width: '100%', margin: 'auto', padding: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
          Redeem Incentives
        </Typography>
        {/* Redemption Items */}
        <Stack>
          {items.map((item) => {
            const isDisabled = userUid ? !item.hasCollected || item.remaining <= 0 : false;
            const isOutOfStock = item.remaining <= 0;
            const hasNotCollected = !item.hasCollected;

            return (
              <ItemCard key={item.id}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Item Image */}
                    <ItemImage src={item.imageURL} variant="rounded">
                      {!item.imageURL && <RedeemIcon sx={{ fontSize: 40, color: '#fff' }} />}
                    </ItemImage>

                    {/* Item Details */}
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                          {item.title}
                        </Typography>
                        <StockChip
                          available={item.remaining > 0}
                          icon={<InventoryIcon sx={{ fontSize: 16 }} />}
                          label={`${item.remaining} left`}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.5 }}>
                        {item.description}
                      </Typography>

                      {/* Criteria */}
                      <CriteriaBox>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333' }}>
                            Criteria:
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          To redeem your gift, you must collect the AR item at{' '}
                          <strong>{item.requiredSpotName}</strong>. Only{' '}
                          <strong>{item.remaining}</strong> gifts are available, so act fast—once
                          they're gone, they're gone!
                        </Typography>
                      </CriteriaBox>

                      {/* Status Messages */}
                      {hasNotCollected && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label="Complete AR collection first"
                            size="small"
                            sx={{ backgroundColor: '#fff3cd', color: '#856404' }}
                          />
                        </Box>
                      )}
                      {isOutOfStock && item.hasCollected && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label="Out of stock"
                            size="small"
                            sx={{ backgroundColor: '#f8d7da', color: '#721c24' }}
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Redeem Button */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <RedeemButton
                        variant="contained"
                        color="error"
                        startIcon={<RedeemIcon />}
                        onClick={() => handleRedeem(item.id, item.title)}
                        disabled={isDisabled}
                      >
                        {!userUid ? 'Login to Redeem' : isDisabled ? 'Unavailable' : 'Redeem'}
                      </RedeemButton>
                    </Box>
                  </Box>
                </CardContent>
              </ItemCard>
            );
          })}
        </Stack>
      </Card>

      {/* Terms and Conditions */}
      <Card sx={{ padding: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
          Terms and Conditions
        </Typography>
        <Box component="ol" sx={{ color: '#666', lineHeight: 1.6 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            1. To be eligible for redemption, users must have collected the required collectibles or
            meet the specified criteria within the event.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            2. Upon clicking the redeem button, a unique code will be displayed for the gift. This
            code must be presented at the redemption point.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            3. Each user can only redeem one gift per event cycle. Multiple attempts will not be
            allowed.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            4. Gift quantities are limited and subject to availability. Redemption will close once
            all gifts have been claimed.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            5. The redemption period is limited to the event duration. Once the event ends, the
            redemption process will no longer be available.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            6. Gifts cannot be exchanged for cash or any other form of compensation.
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            7. The event organizers reserve the right to modify or cancel the redemption process any
            time without prior notice.
          </Typography>
          <Typography component="li" variant="body2">
            8. The delivery or collection of gifts may be subject to location and availability.
            Please follow the instructions provided with the redemption code for gift collection
            details.
          </Typography>
        </Box>
      </Card>
    </Stack>
  );
}
