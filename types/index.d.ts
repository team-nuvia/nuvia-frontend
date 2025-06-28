import type { Palette } from '@mui/material/styles';

export declare global {}
declare module '@mui/material/styles' {
  interface Palette {
    black: Palette['primary'];
    white: Palette['primary'];
  }

  interface PaletteOptions {
    black?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  // variant를 오버라이딩하면 색상이 모드 초기화 됨
  interface ButtonPropsVariantOverrides {
    // rounded: true;
  }
  interface ButtonProps {
    shape?: 'rounded';
  }
}
