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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderRadius: '0px 8px 8px 8px',
            boxShadow: 3,
            minHeight: '380px',
            maxHeight: '380px',
            overflowY: 'auto',
          }}
        >
          <Stack>
            <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
              Sunway University
            </Typography>
            <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
              Renowned for its cutting-edge architecture and vibrant campus life, Sunway University
              is a hub of innovation and academic excellence, offering visitors a glimpse into the
              heart of education and creativity.
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack>
            <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
              Sunway Lagoon
            </Typography>
            <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
              A world-class theme park featuring thrilling water slides, wildlife encounters, and
              exhilarating rides, Sunway Lagoon is a paradise for adventure seekers and families
              alike.
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack>
            <Typography sx={{ fontWeight: 'bold', m: 0, mb: 1 }} fontSize="18px">
              Sunway Pyramid
            </Typography>
            <Typography fontSize="14px" justifySelf={'center'} sx={{ color: 'text.secondary' }}>
              With its iconic pyramid-shaped architecture and sphinx, Sunway Pyramid is a premier
              shopping and entertainment destination, offering a blend of retail therapy,
              international cuisines, and ice-skating fun.
            </Typography>
          </Stack>
        </Box>
      )}
    </div>
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
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary">
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
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </Box>
  );
}
