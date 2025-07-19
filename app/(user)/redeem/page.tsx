'use client';

import { useUserModal } from '@components/providers/UserModalContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RedeemIcon from '@mui/icons-material/Redeem';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grow,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { fetchRedemptionItems, RedemptionItem, redeemItem } from './services/redemptionService';

const StyledCard = styled(Card)(() => ({
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'start',
}));

const ItemImage = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: 16,
  backgroundColor: 'transparent',
  boxShadow: '0 4px 16px #ffdfe0',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  padding: 10,
  [theme.breakpoints.up('sm')]: {
    width: 84,
    height: 84,
  },
}));

const RedeemButton = styled('button')(({ disabled }: { disabled?: boolean }) => ({
  marginTop: 16,
  borderRadius: 9999,
  backgroundColor: disabled ? '#F2F2F7' : '#ED1D24',
  color: disabled ? '#8E8E93' : '#ffffff',
  fontWeight: 600,
  padding: '10px 20px',
  fontSize: '14px',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
}));

const StockChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'available',
})<{ available: boolean }>(({ available }) => ({
  backgroundColor: available ? '#E8F5E8' : '#FFEBEE',
  color: available ? '#2E7D32' : '#D32F2F',
  fontWeight: 600,
  fontSize: '12px',
  height: 28,
  borderRadius: 14,
  padding: '0 5px',
}));

const StatusChip = styled(Chip)(() => ({
  height: 28,
  fontSize: '12px',
  fontWeight: 600,
  borderRadius: 14,
}));

export default function RedemptionPage() {
  const [items, setItems] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { setOpenUserModal } = useUserModal();
  const [collapseOpen, setCollapseOpen] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          setUserUid(user.uid);
          const data = await fetchRedemptionItems(user.uid);
          setItems(data);
        } else {
          setUserUid(null);
          const data = await fetchRedemptionItems();
          setItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch redemption items:', error);
        toast.error('Failed to load redemption data.');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRedeem = async (itemId: string) => {
    const user = getAuth().currentUser;

    if (!user) {
      toast.error('Please log in to redeem this item.');
      setOpenUserModal(true);
      return;
    }

    try {
      const result = await redeemItem(itemId, user.uid, user.displayName || '');
      if (result.success && result.code) {
        toast.success('Redemption code received!');
      } else {
        toast.error(result.message);
        return;
      }
      const updatedItems = await fetchRedemptionItems(user.uid);
      setItems(updatedItems);
    } catch {
      toast.error('Failed to redeem item. Please try again.');
    }
  };

  const handleCardClick = (itemId: string) => {
    setExpandedCard(expandedCard === itemId ? null : itemId);
  };

  const renderSkeletonCards = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <StyledCard key={i}>
        <CardContent sx={{ p: 3 }}>
          <Stack alignItems="center">
            <Box
              sx={{
                width: 84,
                height: 84,
                borderRadius: 2,
                mb: 3,
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px #ffdfe0',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              <Skeleton variant="rounded" width={64} height={64} />
            </Box>

            <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1.5 }} />

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ width: '100%', mt: 1 }}
            >
              <Skeleton variant="rounded" width={80} height={28} />
              <Skeleton variant="rounded" width={120} height={28} />
            </Stack>

            <Skeleton
              variant="rectangular"
              width="100%"
              height={80}
              sx={{ mt: 3, borderRadius: 2 }}
            />
          </Stack>
        </CardContent>
      </StyledCard>
    ));

  const renderRedemptionCards = () =>
    items.map((item, index) => {
      const isDisabled = userUid ? !item.hasCollected || item.remaining <= 0 : false;
      const isExpanded = expandedCard === item.id;

      return (
        <Grow in timeout={600 + index * 150} key={item.id}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Stack
                sx={{ alignItems: 'center', cursor: 'pointer' }}
                onClick={() => handleCardClick(item.id)}
              >
                <ItemImage src={item.imgURL} variant="rounded">
                  {!item.imgURL && <RedeemIcon sx={{ color: 'white' }} />}
                </ItemImage>

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold', mb: 1.5, textAlign: 'center', mt: 3 }}
                >
                  {item.title}
                </Typography>

                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 1, flexWrap: 'wrap', justifyContent: 'center' }}
                  >
                    <StockChip
                      available={item.remaining > 0}
                      label={`${item.remaining} left`}
                      icon={<InventoryIcon />}
                      size="small"
                    />

                    {/* Show code or redemption status if redeemed */}
                    {item.hasRedeemed ? (
                      <StatusChip
                        label="REDEEMED"
                        size="small"
                        sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
                      />
                    ) : item.hasClaimed ? (
                      <StatusChip
                        label={`Code: ${item.code}`}
                        size="small"
                        sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                      />
                    ) : (
                      <>
                        {!item.hasCollected && (
                          <StatusChip
                            label="Collectible required"
                            size="small"
                            sx={{ backgroundColor: '#ffdfe0', color: '#ED1D24' }}
                          />
                        )}
                        {item.remaining <= 0 && item.hasCollected && (
                          <StatusChip
                            label="Out of stock"
                            size="small"
                            sx={{ backgroundColor: '#FFEBEE', color: '#C62828' }}
                          />
                        )}
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>

              {/* Card Expanded */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ color: '#6e6e6e' }}>
                  {item.description}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    backgroundColor: '#F8F9FA',
                    borderRadius: 1,
                    marginTop: 2,
                    padding: 1,
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 20, color: '#8E8E93', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                      To redeem, collect the AR item at{' '}
                      <strong style={{ color: '#ED1D24' }}>{item.requiredSpotName}</strong>.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                  <RedeemButton
                    disabled={!!userUid && (isDisabled || item.hasClaimed)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRedeem(item.id);
                    }}
                  >
                    {!userUid
                      ? 'Login to Redeem'
                      : item.hasClaimed
                        ? 'Redeemed'
                        : isDisabled
                          ? 'Unavailable'
                          : 'Redeem Now'}
                  </RedeemButton>
                </Box>
              </Collapse>
            </CardContent>
          </StyledCard>
        </Grow>
      );
    });

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: '800px',
      }}
    >
      {/* Title */}
      <Box
        sx={{
          position: 'absolute',
          top: '-0px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          borderRadius: '9999px',
          backgroundColor: 'white',
          minHeight: '40px',
          p: '6px',
          width: 'fit-content',
          boxShadow: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            bgcolor: 'brand.main',
            borderRadius: '9999px',
            px: 2,
            py: 1,
            width: 'fit-content',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            REDEMPTIONS
          </Typography>
        </Box>
      </Box>
      <Card
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          paddingTop: '42px',
          paddingX: '16px',
          paddingBottom: '16px',
          marginTop: '20px',
          borderRadius: 2.5,
          boxShadow: 1,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {/* Top Section*/}
        <Box mb={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: '500',
                color: 'text.secondary',
                textAlign: 'center',
              }}
            >
              Total of {items.length} collectibles available for redemption
            </Typography>

            {/* Collapse Button */}

            <IconButton
              onClick={() => setCollapseOpen(!collapseOpen)}
              sx={{
                bgcolor: 'transparent',
                width: 30,
                height: 30,
                transform: collapseOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { bgcolor: alpha('#8E8E93', 0.2) },
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>

          <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
            <Divider sx={{ mb: 2 }} />
            <Card
              sx={{
                p: 2,
                gap: 0.5,
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              <Typography fontSize="0.725rem" sx={{ fontWeight: 'bold' }}>
                Incentives Redemption Terms and Conditions
              </Typography>
              <Stack component="ol" spacing={0.5} sx={{ pl: 1 }}>
                <Typography fontSize="0.688rem" color="text.secondary">
                  1. To be eligible for redemption, users must have collected the required
                  collectibles or meet the specified criteria within the event.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary">
                  2. Upon clicking the redeem button, a unique code will be displayed for the gift.
                  This code must be presented at the redemption point.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary">
                  3. Gift quantities are limited and subject to availability. Redemption will close
                  once all gifts have been claimed.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary">
                  4. The redemption period is limited to the event duration. Once the event ends,
                  the redemption process will no longer be available.
                </Typography>
                <Typography fontSize="0.688rem" color="text.secondary">
                  5. The event organizers reserve the right to modify or cancel the redemption
                  process any time without prior notice.
                </Typography>
              </Stack>
              <Typography fontSize="0.688rem" color="text.secondary">
                By redeeming, you agree to these terms and consent to location tracking solely for
                validation purposes.
              </Typography>
            </Card>

            <Divider sx={{ mb: 1, mt: 3 }} />
          </Collapse>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            alignItems: 'start', 
          }}
        >
          {isLoading ? renderSkeletonCards() : renderRedemptionCards()}
        </Box>
      </Card>
    </Box>
  );
}
