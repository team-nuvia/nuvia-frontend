'use client';
import { Components, createTheme, Theme } from '@mui/material/styles';

const lightMainColor = {
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

const darkMainColor = {
  primary: {
    main: '#4D7FFF', // 다크모드에서 눈에 편안한 소프트 블루
    light: '#7FA3FF', // 더 밝고 부드러운 톤
    dark: '#2E5BFF', // 깊고 세련된 블루
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#9C7FFF', // 눈의 피로를 줄이는 라벤더 퍼플
    light: '#B8A3FF', // 소프트한 라이트 퍼플
    dark: '#7A5FFF', // 깊이감 있는 다크 퍼플
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#4CAF50', // 다크모드에 최적화된 그린
    light: '#81C784', // 부드럽고 시각적으로 편안한 라이트 그린
    dark: '#388E3C', // 차분하고 안정감 있는 다크 그린
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF9800', // 다크모드에서 경고를 잘 표현하는 오렌지
    light: '#FFB74D', // 따뜻하고 부드러운 라이트 오렌지
    dark: '#F57C00', // 강조감 있는 다크 오렌지
    contrastText: '#000000', // 다크 배경에서 가독성을 위한 검은 텍스트
  },
  error: {
    main: '#F44336', // 다크모드에 적합한 에러 레드
    light: '#E57373', // 부드럽고 시각적 충격을 줄인 라이트 레드
    dark: '#D32F2F', // 강한 경고감을 주는 다크 레드
    contrastText: '#FFFFFF',
  },
};

const MuiTypography: Components<Omit<Theme, 'components'>>['MuiTypography'] = {
  defaultProps: {
    component: 'div',
  },
  styleOverrides: {
    h1: {
      fontSize: '5rem',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    h2: {
      fontSize: '4rem',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    h3: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.5',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1.5',
    },
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
};

const MuiChip: Components<Omit<Theme, 'components'>>['MuiChip'] = {
  styleOverrides: {
    root: {
      fontWeight: 600,
      borderRadius: '16px',
    },
  },
  variants: [
    {
      props: { color: 'white' },
      style: {
        backgroundColor: '#1C1C1C',
        color: '#FFFFFF',
      },
    },
    {
      props: { color: 'black' },
      style: {
        backgroundColor: '#FFFFFF',
        color: '#1C1C1C',
      },
    },
  ],
};

const MuiCircularProgress: Components<Omit<Theme, 'components'>>['MuiCircularProgress'] = {
  styleOverrides: {
    root: {
      color: 'inherit',
    },
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
      // {
      //   props: {
      //     color: 'black',
      //   },
      //   style: {
      //     backgroundColor: '#1C1C1C',
      //     color: '#FFFFFF',
      //   },
      // },
      // {
      //   props: {
      //     color: 'white',
      //   },
      //   style: {
      //     backgroundColor: '#FFFFFF',
      //     color: '#1C1C1C',
      //   },
      // },
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
      {
        props: {
          size: 'xlarge',
        },
        style: {
          paddingInline: '1.2rem',
          paddingBlock: '0.8rem',
          fontSize: '1.1rem',
        },
      },
    ],
  },
  MuiTypography,
  MuiChip,
  MuiCircularProgress,
};

const lightTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  components,
  palette: {
    mode: 'light',
    ...lightMainColor,
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
      light: '#4D4D4D',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    white: {
      main: '#FFFFFF',
      light: '#F1F1F1',
      dark: '#E0E0E0',
      contrastText: '#1C1C1C',
    },
  },
});

const darkTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  components,
  palette: {
    mode: 'dark',
    ...darkMainColor,
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
      light: '#F1F1F1',
      dark: '#E0E0E0',
      contrastText: '#1C1C1C',
    },
    white: {
      main: '#1C1C1C',
      light: '#4D4D4D',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
  },
});

export { darkTheme, lightTheme };
