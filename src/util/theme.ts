'use client';
import { Components, createTheme, Theme } from '@mui/material/styles';

const commonColor = {
  primary: {
    main: '#3D5AFE',
    light: '#768FFF',
    dark: '#0031CA',
  },
  secondary: {
    main: '#7C4DFF',
    light: '#B085FF',
    dark: '#5600E8',
  },
  success: {
    main: '#00A344', // 더 어둡고 짙게
    light: '#33C76E', // 밝은 초록, contrastText: white 확보
    dark: '#007A33', // 짙은 녹색
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F57C00', // 기존보다 더 어두운 오렌지
    light: '#FFA040', // 살짝 밝은 톤
    dark: '#BB4D00', // 딥 오렌지 계열
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D50000',
    light: '#FF5252',
    dark: '#9B0000',
  },
};

const components: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    variants: [
      {
        props: {
          shape: 'default',
        },
        style: {},
        // style: {
        //   borderRadius: '999px',
        //   paddingLeft: '24px',
        //   paddingRight: '24px',
        //   textTransform: 'none',
        //   fontWeight: 600,
        // },
      },
      {
        props: {
          shape: 'rounded',
        },
        style: {
          borderRadius: '999px',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          fontWeight: 600,
          textTransform: 'uppercase',
        },
      },
    ],
  },
  MuiTypography: {
    defaultProps: {
      component: 'div',
    },
    variants: [
      {
        props: { thickness: 'thin' },
        style: {
          fontWeight: 300,
        },
      },
      {
        props: { thickness: 'regular' },
        style: {
          fontWeight: 400,
        },
      },
      {
        props: { thickness: 'medium' },
        style: {
          fontWeight: 500,
        },
      },
      {
        props: { thickness: 'bold' },
        style: {
          fontWeight: 700,
        },
      },
    ],
  },
};

const lightTheme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  components,
  palette: {
    ...commonColor,
    background: {
      default: '#F1F1F1',
      paper: '#FEFEFE',
    },
    text: {
      primary: '#1C1C1C',
      secondary: '#4D4D4D',
      disabled: '#BDBDBD',
    },
    black: {
      main: '#1C1C1C',
      contrastText: '#FFFFFF',
    },
    white: {
      main: '#FFFFFF',
      contrastText: '#1C1C1C',
    },
  },
});

const darkTheme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  components,
  palette: {
    ...commonColor,
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      disabled: '#666666',
    },
    black: {
      main: '#FFFFFF',
      contrastText: '#1C1C1C',
    },
    white: {
      main: '#1C1C1C',
      contrastText: '#FFFFFF',
    },
  },
});

export { lightTheme, darkTheme };
