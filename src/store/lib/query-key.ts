/* query key에 사용되는 키 목록 */
/* event bus에서 필요한 키 도메인 별로 뜯어서 사용 */

const userKeys = {
  me: () => ['user', 'me'] as const,
  settings: () => ['user', 'settings'] as const,
};

const surveyKeys = {
  list: () => ['survey'] as const,
  detail: (id?: number) => ['survey', 'detail', id] as const,
  binList: () => ['survey', 'bin'] as const,
  categoryList: () => ['categories'] as const,
  metadata: () => ['survey', 'metadata'] as const,
};

const organizationKeys = {
  list: () => ['organizations'] as const,
  role: () => ['organizations', 'role'] as const,
  detail: (id?: number) => ['organizations', 'role', id] as const,
};

const notificationKeys = {
  list: () => ['notifications'] as const,
};

const dashboardKeys = {
  recentSurvey: () => ['dashboard', 'recent', 'survey'] as const,
  metadata: () => ['dashboard', 'metadata'] as const,
};

const graphKeys = {
  dailyResponseCount: () => ['daily-response-count'] as const,
};

export { dashboardKeys, graphKeys, notificationKeys, organizationKeys, surveyKeys, userKeys };
