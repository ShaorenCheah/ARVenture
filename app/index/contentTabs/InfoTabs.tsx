'use client';

import { Tabs, Tab, Box } from '@mui/material';
import dynamic from 'next/dynamic';
import * as React from 'react';
const ArSpotPanel = dynamic(() => import('./arSpots/ArSpotPanel'), {
  ssr: false,
});

const LocationModal = dynamic(() => import('../LocationModal'), {
  ssr: false,
});
import EventPanel from './events/EventPanel';

export default function InfoTabs() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [selectedSpot, setSelectedSpot] = React.useState<{
    title: string;
    description: string;
    imageUrl: string;
    address?: string;
    collectibleTips?: string;
  } | null>(null);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: { xs: '375px', md: '475px', lg: '100vh' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
          sx={{
            flexShrink: 0,
            zIndex: 1,
            '& .MuiTabs-root, .MuiButtonBase-root, .MuiTabs-scroller,': {
              minHeight: { xs: '40px', md: '48px' },
              maxHeight: { xs: '40px', md: '48px' },
            },
            '& .MuiTab-root': {
              width: '110px',
              fontWeight: 'bold',
              borderRadius: '6px 6px 0 0',
              backgroundColor: 'white',
              zIndex: 1,
              position: 'relative',
              transition: 'all 0.2s ease',
            },
            '& .Mui-selected': {
              zIndex: 2,
              boxShadow: 3,
              backgroundColor: 'white',
              color: '#2A3547',
            },
            '& .MuiTabs-indicator': {
              zIndex: 3,
            },
          }}
        >
          <Tab label="AR SPOTS" />
          <Tab label="EVENTS" />
        </Tabs>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: 'white',
            borderRadius: '0 6px 6px 6px',
            boxShadow: 3,
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
          }}
        >
          {tabIndex === 0 ? (
            <ArSpotPanel
              onSpotClick={(spotData) => {
                setSelectedSpot(spotData);
                setOpen(true);
              }}
            />
          ) : (
            <EventPanel />
          )}
        </Box>
      </Box>

      {open && (
        <LocationModal
          open={open}
          onClose={() => setOpen(false)}
          spot={selectedSpot ?? undefined}
        />
      )}
    </>
  );
}
