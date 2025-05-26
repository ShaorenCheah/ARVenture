'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LocationModal from '../general/locationModal'; // Adjust path as needed
import { Divider, Stack, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
  handleOpen?: () => void;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, handleOpen, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      sx={{
        flex: 1,
        display: value === index ? 'flex' : 'none',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 0, // Allow flex child to shrink
      }}
    >
      {value === index && (
        <Box
          sx={{
            flex: 1,
            borderRadius: '0px 6px 6px 6px',
            backgroundColor: 'white',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0, // Allow flex child to shrink
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
            }}
          >
            <Stack spacing={2}>
              {children}
              <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} variant="h5">
                  Sunway University
                </Typography>
                <Typography justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  Renowned for its cutting-edge architecture and vibrant campus life, Sunway
                  University is a hub of innovation and academic excellence, offering visitors a
                  glimpse into the heart of education and creativity.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} variant="h5">
                  Sunway Lagoon
                </Typography>
                <Typography justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  A world-class theme park featuring thrilling water slides, wildlife encounters,
                  and exhilarating rides, Sunway Lagoon is a paradise for adventure seekers and
                  families alike.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} variant="h5">
                  Sunway Pyramid
                </Typography>
                <Typography justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  With its iconic pyramid-shaped architecture and sphinx, Sunway Pyramid is a
                  premier shopping and entertainment destination, offering a blend of retail
                  therapy, international cuisines, and ice-skating fun.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} variant="h5">
                  Sunway Resort
                </Typography>
                <Typography justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  A luxury resort offering world-class amenities, spa services, and fine dining
                  experiences in the heart of Sunway City, perfect for relaxation and business
                  travelers.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} variant="h5">
                  Sunway Medical Centre
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  A leading healthcare facility providing comprehensive medical services with
                  state-of-the-art technology and expert medical professionals.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function InfoTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // State for modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%', // Take full height of parent
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0, // Allow flex child to shrink below content size
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
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
          <Tab
            label="AR SPOTS"
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px 8px 0px 0px',
              boxShadow: 3,
              fontWeight: 'bold',
            }}
            {...a11yProps(0)}
          />
          <Tab
            label="EVENTS"
            sx={{ backgroundColor: 'white', borderRadius: '8px 8px 0px 0px', fontWeight: 'bold' }}
            {...a11yProps(1)}
          />
        </Tabs>
        <TabPanel value={value} index={0} handleOpen={handleOpen}></TabPanel>
        <TabPanel value={value} index={1}></TabPanel>
      </Box>

      <LocationModal open={open} onClose={handleClose} />
    </>
  );
}
