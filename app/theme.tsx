// theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    allVariants: {
      color: '#2A3547', // Default font color
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
  },
  palette: {
    primary: { main: '#ED1D24' },
    secondary: { main: '#F9DC5C' },
    background: {
      default: 'white',
    },
  },
  spacing: 8, // base spacing unit (8px)
});

// Responsive typography settings
theme = responsiveFontSizes(theme);

export default theme;
