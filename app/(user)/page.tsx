'use client';

import { useAuth } from '@auth/AuthContext';
import { useSplash } from '@components/providers/SplashContext';
import { Card } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InfoTabs from '@user/index/contentTabs/InfoTabs';
import GuideModal from '@user/index/GuideModal';
import { useEffect, useState } from 'react';

export default function Home() {
  const [openGuideModal, setOpenGuideModal] = useState(false);

  const { user } = useAuth();

  const { showSplash } = useSplash();

  useEffect(() => {
    if (showSplash) return; // do nothing while splash is showing

    const hasShownGuide = sessionStorage.getItem('guideShown');
    if (!user && !hasShownGuide) {
      const timer = setTimeout(() => {
        setOpenGuideModal(true);
        sessionStorage.setItem('guideShown', 'true');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, showSplash]);

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        height: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0, // Allow shrinking
        mt: { xs: 0, lg: 3 },
      }}
    >
      <Grid
        container
        flexWrap="nowrap"
        flexDirection={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 2, md: 2.5 }}
        sx={{
          alignItems: 'stretch',
          height: { xs: 'auto', lg: '100%' },
          flex: 1,
          flexGrow: 1,
          minHeight: 0, // Allow flex items to shrink below content size
        }}
      >
        {/* Map Section */}
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flex: 1,
            minHeight: 0, // Allow shrinking
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: { xs: '300px', sm: '350px', md: '375px', lg: '100%' },
              width: { xs: '300px', sm: '350px', md: '375px', lg: '100%' },
              maxWidth: { xs: '100%', md: 'auto', lg: '100%' }, // Ensure it doesn't exceed container
              maxHeight: '100%', // Prevent overflow
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 1,
              position: 'relative',
              backgroundColor: 'white',
              border: 'none',
            }}
          >
            <Box
              component="img"
              src="/map.png"
              alt="ARVenture Map"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'absolute',
                top: 0,
                left: 0,
                px: 1,
              }}
            />
          </Card>
        </Grid>

        {/* Info Section */}
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            height: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
            }}
          >
            <InfoTabs />
          </Box>
        </Grid>
      </Grid>

      {/* Guide Modal */}
      <GuideModal open={openGuideModal} onClose={() => setOpenGuideModal(false)} />
    </Box>
  );
}
