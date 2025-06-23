'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InfoTabs from './components/index/contentTabs/InfoTabs';
import GuideModal from './components/index/GuideModal';
import { Card } from '@mui/material';
import { useAuth } from './auth/AuthContext';

export default function Home() {
  const [openGuideModal, setOpenGuideModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);

  const { user } = useAuth(); // Access user auth state

  useEffect(() => {
    const hasShownGuide = sessionStorage.getItem('guideShown');

    if (!user && !hasShownGuide) {
      const timer = setTimeout(() => {
        setOpenGuideModal(true);
        sessionStorage.setItem('guideShown', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        height: {
          xs: '100%',
          lg: 'calc(100vh - 72px - 80px - 32px)',
          xl: 'calc(100vh - 88px - 80px - 32px)',
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid
        container
        flexWrap="nowrap"
        flexDirection={{ xs: 'column', lg: 'row' }}
        spacing={{ xs: 2, md: 2.5 }}
        sx={{ alignItems: 'start', height: '100%', flex: 1 }}
      >
        {/* Map Section */}
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: {
              xs: 'auto',
              sm: '50%',
              lg: '100%',
            },
            maxHeight: { xs: 'unset', sm: '400px', md: '425px', lg: '100%' },
            aspectRatio: '1/1',
            flexShrink: { xs: 0, md: 1 },
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              aspectRatio: '1/1',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 3,
              position: 'relative',
              backgroundColor: 'white',
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
              }}
            />
          </Card>
        </Grid>

        {/* Info Section */}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ height: '100%', flex: { xs: 1, lg: 'unset' } }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              minHeight: { xs: 0, lg: 'unset' },
            }}
          >
            <InfoTabs setOpenUserModal={setOpenUserModal} />
          </Box>
        </Grid>
      </Grid>

      {/* Guide Modal */}
      <GuideModal open={openGuideModal} onClose={() => setOpenGuideModal(false)} />
    </Box>
  );
}
