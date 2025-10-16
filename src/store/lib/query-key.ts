/* query key에 사용되는 키 목록 */
/* event bus에서 필요한 키 도메인 별로 뜯어서 사용 */

import { SurveyStatus } from '@share/enums/survey-status';

const queryKeys = {
  analyses: {
    basic: (surveyId: number | string) => ['analyses', 'basic', surveyId] as const,
  },
  user: {
    me: () => ['user', 'me'] as const,
    settings: () => ['user', 'settings'] as const,
  },
  category: {
    list: () => ['categories'] as const,
  },
  survey: {
    list: (type?: SurveyStatus) => ['survey', 'list', type ?? 'all'] as const,
    detail: (id?: number) => ['survey', 'detail', id] as const,
    binList: () => ['survey', 'bin'] as const,
    categoryList: () => ['categories', 'list'] as const,
    metadata: () => ['survey', 'metadata'] as const,
  },
  organization: {
    list: () => ['organizations', 'list'] as const,
    role: (id?: number) => ['organizations', 'role', id] as const,
    detail: (id?: number) => ['organizations', 'role', id] as const,
  },
  notification: {
    list: () => ['notification', 'list'] as const,
  },
  dashboard: {
    recentSurvey: () => ['dashboard', 'recent', 'survey'] as const,
    metadata: () => ['dashboard', 'metadata'] as const,
  },
  graph: {
    dailyResponseCount: () => ['daily-response-count'] as const,
  },
  plan: {
    list: () => ['plan', 'list'] as const,
  },
};

export default queryKeys;
