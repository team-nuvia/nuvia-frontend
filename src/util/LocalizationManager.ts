import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { SurveyStatus } from '@share/enums/survey-status';
import { UserRole } from '@share/enums/user-role';

export const TRANSLATE_TOKEN = {
  [SurveyStatus.Draft]: '초안',
  [SurveyStatus.Active]: '진행중',
  [SurveyStatus.Closed]: '마감',
  [UserRole.Viewer]: '뷰어',
  [UserRole.Editor]: '편집자',
  [UserRole.Admin]: '관리자',
  [UserRole.Owner]: '소유자',
  [OrganizationRoleStatusType.Invited]: '초대됨',
  [OrganizationRoleStatusType.Joined]: '참여',
  [OrganizationRoleStatusType.Deactivated]: '비활성',
  [MetadataStatusType.Dashboard]: '대시보드',
  [MetadataStatusType.SurveyList]: '설문 목록',
  ['notification.' + NotificationActionStatus.Joined]: '초대됨',
  ['notification.' + NotificationActionStatus.Rejected]: '거절',
  [PlanNameType.Free]: '무료',
  [PlanNameType.Basic]: '기본',
  [PlanNameType.Premium]: '프리미엄',
} as const;
export type TRANSLATE_TOKEN = (typeof TRANSLATE_TOKEN)[keyof typeof TRANSLATE_TOKEN];

export const COLOR_TOKEN = {
  [SurveyStatus.Draft]: 'textSecondary',
  [SurveyStatus.Active]: 'success.main',
  [SurveyStatus.Closed]: 'error.main',
  [UserRole.Viewer]: 'textSecondary',
  [UserRole.Editor]: 'success.main',
  [UserRole.Admin]: 'primary.main',
  [UserRole.Owner]: 'error.main',
  [OrganizationRoleStatusType.Invited]: 'textSecondary',
  [OrganizationRoleStatusType.Joined]: 'success.main',
  [OrganizationRoleStatusType.Deactivated]: 'error.main',
  [MetadataStatusType.Dashboard]: 'textSecondary',
  [MetadataStatusType.SurveyList]: 'textSecondary',
  ['notification.' + NotificationActionStatus.Joined]: 'success.main',
  ['notification.' + NotificationActionStatus.Rejected]: 'error.main',
} as const;
export type COLOR_TOKEN = (typeof COLOR_TOKEN)[keyof typeof COLOR_TOKEN];

// enum값 번역 및 color 지정 클래스
export class LocalizationManager {
  static translate(key: keyof typeof TRANSLATE_TOKEN) {
    return TRANSLATE_TOKEN[key];
  }

  static color<T extends keyof typeof COLOR_TOKEN>(key: T): (typeof COLOR_TOKEN)[T] {
    return COLOR_TOKEN[key];
  }
}
