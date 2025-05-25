// theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Step 1: Create a base theme to access breakpoints
let baseTheme = createTheme({
  palette: {
    primary: { main: '#ED1D24' },
    secondary: { main: '#F9DC5C' },
    background: {
      default: 'white',
    },
  },
  spacing: 8,
});

let theme = createTheme(baseTheme, {
  typography: {
    fontFamily: 'Inter, sans-serif',
    allVariants: {
      color: '#2A3547',
    },
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '2.5rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '3rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '2rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '2.25rem',
      },
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.9rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '1rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.1rem',
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
