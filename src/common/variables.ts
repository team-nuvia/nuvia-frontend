import { SurveyStatus } from '@share/enums/survey-status';

export const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST;
export const SERVER_PORT = process.env.NEXT_PUBLIC_SERVER_PORT;
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME as string;
export const LOGO_ONLY = process.env.NEXT_PUBLIC_LOGO_ONLY as string;
export const LOGO_ONLY_SVG = process.env.NEXT_PUBLIC_LOGO_ONLY_SVG as string;

export const SURVEY_STATUS_LABELS = {
  [SurveyStatus.Active]: '진행중',
  [SurveyStatus.Draft]: '초안',
  [SurveyStatus.Closed]: '마감',
} as const;
export type SURVEY_STATUS_LABELS = (typeof SURVEY_STATUS_LABELS)[keyof typeof SURVEY_STATUS_LABELS];

export const MetadataStatusType = {
  SurveyList: 'surveyList',
  Dashboard: 'dashboard',
} as const;
export type MetadataStatusType = (typeof MetadataStatusType)[keyof typeof MetadataStatusType];
