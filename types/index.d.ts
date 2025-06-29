import type { Palette } from '@mui/material/styles';

export declare global {
  declare interface MenuModel {
    label: string;
    name: string;
    to: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  }
}
declare module '@mui/material/styles' {
  interface Palette {
    black: Palette['primary'];
    white: Palette['primary'];
    // parent: Palette['primary'];
  }

  interface PaletteOptions {
    black?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
    // parent?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  // variant를 오버라이딩하면 색상이 모드 초기화 됨
  declare interface ButtonPropsVariantOverrides {
    // rounded: true;
  }
  declare interface ButtonOwnProps {
    shape?: 'default' | 'rounded';
  }

  declare interface ButtonPropsColorOverrides {
    black: true;
    white: true;
    // parent: true;
  }
}

declare module '@mui/material/Typography' {
  declare interface TypographyPropsVariantOverrides {
    // 모든 타입 오버라이딩
  }

  declare interface TypographyOwnProps {
    thickness?: 'thin' | 'regular' | 'medium' | 'bold';
  }
}
