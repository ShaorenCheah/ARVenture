// theme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

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
    h3: {
      fontWeight: 500,
      fontSize: '1.25rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '1.5rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontWeight: 500,
      fontSize: '1rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '1.25rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: 400,
      fontSize: '0.875rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '1rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.125rem',
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontWeight: 400,
      fontSize: '0.75rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '0.875rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1rem',
      },
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.688rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '0.875rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1rem',
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1.125rem',
      },
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.625rem',
      [baseTheme.breakpoints.up('sm')]: {
        fontSize: '0.75rem',
      },
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '0.875rem',
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1rem',
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#ccc transparent',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
