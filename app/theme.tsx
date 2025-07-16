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
      light: '#ffdfe0',
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
    // More conservative desktop sizes, better mobile scaling
    h1: {
      fontWeight: 700,
      fontSize: '1.75rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '2rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '2.25rem' },
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.375rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '1.625rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1.875rem' },
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.125rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '1.25rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1.5rem' },
    },
    h4: {
      fontWeight: 500,
      fontSize: '1rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '1.125rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1.25rem' },
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
      fontSize: '0.875rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '0.9375rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '1rem' },
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.75rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '0.8125rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '0.875rem' },
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.688rem',
      [baseTheme.breakpoints.up('sm')]: { fontSize: '0.75rem' },
      [baseTheme.breakpoints.up('md')]: { fontSize: '0.8125rem' },
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          // Mobile-first approach with desktop override
          fontSize: '16px', // Always 16px on mobile to prevent iOS zoom
          paddingTop: '20px',
          paddingBottom: '12px',
          // Desktop override
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '14px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px', // Default label size
          '&.Mui-focused:not(.MuiInputLabel-shrink)': {
            fontSize: '16px', // 16px when focused on mobile to prevent zoom
            [baseTheme.breakpoints.up('md')]: {
              fontSize: '14px',
            },
          },
          '&.MuiInputLabel-shrink': {
            fontSize: '12px', // Shrunk size
            transform: 'translate(14px, -9px) scale(1)',
            [baseTheme.breakpoints.up('md')]: {
              fontSize: '11px',
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px', // Base size for form labels
          '&.Mui-focused:not(.MuiInputLabel-shrink)': {
            fontSize: '16px', // 16px only when actively focused on mobile
            [baseTheme.breakpoints.up('md')]: {
              fontSize: '14px',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ED1D24',
          },
        },
        notchedOutline: {
          '& legend': {
            fontSize: '12px', // Match the shrunk label size
            [baseTheme.breakpoints.up('md')]: {
              fontSize: '11px',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '16px',
            [baseTheme.breakpoints.up('md')]: {
              fontSize: '14px',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: '16px',
          [baseTheme.breakpoints.up('md')]: {
            fontSize: '14px',
          },
        },
      },
    },
  },
});

// Apply responsive font sizes but with more conservative scaling
theme = responsiveFontSizes(theme, {
  breakpoints: ['sm', 'md', 'lg'],
  disableAlign: false,
  factor: 1.2,
  variants: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline',
  ],
});

export default theme;
