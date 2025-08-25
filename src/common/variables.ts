import { SurveyStatus } from '@share/enums/survey-status';
import { UserRole } from '@share/enums/user-role';

export const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST;
export const SERVER_PORT = process.env.NEXT_PUBLIC_SERVER_PORT;
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME as string;
export const LOGO_ONLY = process.env.NEXT_PUBLIC_LOGO_ONLY as string;
export const LOGO_ONLY_SVG = process.env.NEXT_PUBLIC_LOGO_ONLY_SVG as string;

export const SURVEY_STATUS_LABELS = {
  [SurveyStatus.Draft]: '초안',
  [SurveyStatus.Active]: '진행중',
  [SurveyStatus.Closed]: '마감',
} as const;
export type SURVEY_STATUS_LABELS = (typeof SURVEY_STATUS_LABELS)[keyof typeof SURVEY_STATUS_LABELS];

export const USER_ROLE_LABELS = {
  [UserRole.Viewer]: '뷰어',
  [UserRole.Editor]: '편집자',
  [UserRole.Admin]: '관리자',
  [UserRole.Owner]: '소유자',
} as const;
export type USER_ROLE_LABELS = (typeof USER_ROLE_LABELS)[keyof typeof USER_ROLE_LABELS];
