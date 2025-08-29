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

  interface ServerResponse<T> extends Payload<T> {
    ok: true;
    httpStatus: number;
    name: string;
    message: string;
    reason: string | string[] | null;
  }

  interface MenuOption {
    label: string;
    to: string;
    request?: () => Promise<void>;
  }

  type PromiseServerResponse<T> = Promise<ServerResponse<T> | void>;

  declare interface MenuModel {
    label: string;
    name: string;
    to?: string;
    request?: () => void;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    children?: MenuModel[];
  }

  declare module '*.svg' {
    import * as React from 'react';
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
  }

  /* Analysis Types */
  export type QuestionType = 'single' | 'multiple' | 'number' | 'date' | 'text';

  export interface AnswerResponseItem {
    questionId: number;
    optionIds: number[] | null;
    value: string | null;
  }

  export interface StartAnswerInitialValues {
    userAgent: string;
    startAt: Date | null;
  }

  export interface AnswerInitialValues {
    answers: AnswerResponseItem[];
  }

  export interface OverviewStats {
    totalResponses: number;
    avgResponsesPerSurvey: number;
    growth30dPct: number;
    completionRate?: number | null;
  }
  export interface TrendPoint {
    date: string;
    count: number;
  }
  export interface OverviewPayload {
    surveyId: string;
    title: string;
    periodLabel: string;
    stats: OverviewStats;
    dailyTrend: TrendPoint[];
  }

  export interface ChoiceBucket {
    value: string;
    count: number;
  }
  export interface NumberBin {
    x0: number;
    x1: number;
    count: number;
  }
  export interface DateBucket {
    date: string;
    count: number;
  }
  export interface TextSample {
    snippet: string;
    count?: number;
  }

  export type Distribution =
    | { type: 'single'; buckets: ChoiceBucket[] }
    | { type: 'multiple'; buckets: ChoiceBucket[] }
    | { type: 'number'; bins: NumberBin[] }
    | { type: 'date'; buckets: DateBucket[] }
    | { type: 'text'; samples: TextSample[] };

  export interface QuestionDistribution {
    questionId: string;
    questionTitle: string;
    questionType: QuestionType;
    distribution: Distribution;
    totalAnswers: number;
    note?: string;
  }

  export interface AnalysisPageData {
    overview: OverviewPayload;
    questions: QuestionDistribution[];
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

declare module '@mui/material/CircularProgress' {
  declare interface CircularProgressPropsColorOverrides {
    black: true;
    white: true;
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

declare module '@mui/material/Chip' {
  declare interface ChipPropsColorOverrides {
    black: true;
    white: true;
  }
}
