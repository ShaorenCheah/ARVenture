import { createTheme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      main: string;
      accent: string;
      light: string;
    };
  }
  interface PaletteOptions {
    brand?: {
      main: string;
      accent: string;
      light: string;
    };
  }
}

let baseTheme = createTheme({
  palette: {
    primary: { main: '#ED1D24' },
    secondary: { main: '#c70e14' },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
    brand: {
      main: '#ED1D24',
      accent: '#c70e14',
      light: '#f87171',
    },
    background: {
      default: 'white',
    },
  },
  spacing: 8,
});

baseTheme.shadows[1] = '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)';

let theme = createTheme(baseTheme, {
  typography: {
    fontFamily: 'Inter, sans-serif',
    allVariants: {
      color: '#2A3547',
    },
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '2.5rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '3rem' },
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '2rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '2.25rem' },
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.25rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '1.5rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1.75rem' },
    },
    h4: {
      fontWeight: 500,
      fontSize: '1rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '1.25rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1.5rem' },
    },
    h5: {
      fontWeight: 400,
      fontSize: '0.875rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '1rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1.125rem' },
    },
    h6: {
      fontWeight: 400,
      fontSize: '0.75rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '0.875rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1rem' },
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.875rem', // 14px baseline
      [baseTheme.breakpoints.up('sm')]: { fontSize: '1rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1.125rem' },
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.75rem', // 12px baseline
      [baseTheme.breakpoints.up('sm')]: { fontSize: '0.875rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1rem' },
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.688rem', // 10px baseline
      [baseTheme.breakpoints.up('sm')]: { fontSize: '0.75rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '0.875rem' },
    },
  },
  components: {
    // MuiCssBaseline: {
    //   styleOverrides: {
    //     body: {
    //       scrollbarWidth: 'thin',
    //       scrollbarColor: '#ccc transparent',
    //       '&::-webkit-scrollbar': { width: '6px' },
    //       '&::-webkit-scrollbar-thumb': {
    //         backgroundColor: '#ccc',
    //         borderRadius: '4px',
    //       },
    //       '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
    //     },
    //   },
    // },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '16px',
          paddingTop: '20px',
          paddingBottom: '12px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px', // Default label size - smaller to fit properly
          '&.Mui-focused:not(.MuiInputLabel-shrink)': {
            fontSize: '16px', // Only 16px when focused and not shrunk (prevents iOS zoom)
          },
          '&.MuiInputLabel-shrink': {
            fontSize: '12px', // Even smaller when shrunk
            transform: 'translate(14px, -9px) scale(1)',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px', // Base size for form labels
          '&.Mui-focused:not(.MuiInputLabel-shrink)': {
            fontSize: '16px', // 16px only when actively focused to prevent iOS zoom
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          '& legend': {
            fontSize: '12px', // Match the shrunk label size
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
