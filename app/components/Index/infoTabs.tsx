'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Divider, Stack, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

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
        overflow: 'hidden', // Prevent overflow from this container
      }}
    >
      {value === index && (
        <Box
          sx={{
            flex: 1,
            borderRadius: '0px 8px 8px 8px',
            backgroundColor: 'white',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Important: contain the overflow
            maxHeight: '100%', // Ensure it doesn't exceed parent
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              maxHeight: '100%', // Constraint for scrolling
            }}
          >
            <Stack spacing={2}>
              {children}
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
                  Sunway University
                </Typography>
                <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  Renowned for its cutting-edge architecture and vibrant campus life, Sunway
                  University is a hub of innovation and academic excellence, offering visitors a
                  glimpse into the heart of education and creativity.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
                  Sunway Lagoon
                </Typography>
                <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  A world-class theme park featuring thrilling water slides, wildlife encounters,
                  and exhilarating rides, Sunway Lagoon is a paradise for adventure seekers and
                  families alike.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
                  Sunway Pyramid
                </Typography>
                <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  With its iconic pyramid-shaped architecture and sphinx, Sunway Pyramid is a
                  premier shopping and entertainment destination, offering a blend of retail
                  therapy, international cuisines, and ice-skating fun.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
                  Sunway Resort
                </Typography>
                <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  A luxury resort offering world-class amenities, spa services, and fine dining
                  experiences in the heart of Sunway City, perfect for relaxation and business
                  travelers.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
                  Sunway Medical Centre
                </Typography>
                <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  A leading healthcare facility providing comprehensive medical services with
                  state-of-the-art technology and expert medical professionals.
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
                  Additional Content
                </Typography>
                <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
                  This is additional content to demonstrate the scrolling behavior when content
                  exceeds the container height. The TabPanel should maintain the same height as the
                  image while allowing this content to scroll vertically.
                </Typography>
              </Box>
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

export default function ColorTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: {
          xs: '1 / 1', // Square on mobile
          md: '1 / 1', // Square on medium screens (6/6 split)
          lg: '7 / 5', // Adjust ratio for lg screens (7/5 split)
        },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent the container from growing
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          flexShrink: 0, // Prevent tabs from shrinking
          zIndex: 1, // Ensure tabs stay on top
        }}
      >
        <Tab
          label="AR SPOTS"
          sx={{ backgroundColor: 'white', borderRadius: '8px 8px 0px 0px', boxShadow: 3 }}
          {...a11yProps(0)}
        />
        <Tab
          label="EVENTS"
          sx={{ backgroundColor: 'white', borderRadius: '8px 8px 0px 0px', minWidth: '100px' }}
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        Lorem Ipsum 1
      </TabPanel>
      <TabPanel value={value} index={1}>
        Lorem Ipsum 2
      </TabPanel>
    </Box>
  );
}
