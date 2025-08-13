import '@mui/material/styles';
import { SurveyStatus } from '@share/enums/survey-status';
import { AllQuestion } from '@share/interface/iquestion';

export declare global {
  interface Payload<T> {
    payload: T | null;
  }

  interface QuestionInitialValues {
    title: string;
    description: string | null;
    categoryId: string;
    expiresAt: Date | null;
    isPublic: boolean;
    status: SurveyStatus;
    questions: Omit<AllQuestion, 'answers' | 'isAnswered'>[];
  }

  interface ServerResponse<T extends any> extends Payload<T> {
    ok: true;
    httpStatus: 200;
    name: 'GetUserMeResponseDto';
    message: '사용자 정보 조회 성공';
    reason: null;
  }

  interface MenuOption {
    label: string;
    to: string;
    request?: () => Promise<void>;
  }

  type PromiseServerResponse<T extends any> = Promise<ServerResponse<T> | void>;

  declare interface MenuModel {
    label: string;
    name: string;
    to: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  }

  declare module '*.svg' {
    import * as React from 'react';
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
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

  declare interface ButtonPropsSizeOverrides {
    xlarge: true;
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
