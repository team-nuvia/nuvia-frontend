const mutationKeys = {
  survey: {
    create: () => ['survey', 'create'] as const,
    createAnswer: () => ['survey', 'createAnswer'] as const,
    validateFirstAnswer: () => ['survey', 'validateFirstAnswer'] as const,
    startAnswer: () => ['survey', 'startAnswer'] as const,
  },
  auth: {
    refreshJws: () => ['auth', 'refreshJws'] as const,
    getCsrfToken: () => ['auth', 'getCsrfToken'] as const,
  },
  user: {
    login: () => ['user', 'login'] as const,
    settings: () => ['user', 'settings'] as const,
    forgotPassword: () => ['user', 'forgotPassword'] as const,
    resetPassword: () => ['user', 'resetPassword'] as const,
    signup: () => ['user', 'signup'] as const,
    latestActive: () => ['user', 'latestActive'] as const,
    updateUserInfo: () => ['user', 'updateUserInfo'] as const,
    changePassword: () => ['user', 'changePassword'] as const,
    suspendAccount: () => ['user', 'suspendAccount'] as const,
    deleteAccount: () => ['user', 'deleteAccount'] as const,
    verifyInvitationToken: () => ['user', 'verifyInvitationToken'] as const,
    verifyToken: () => ['user', 'verifyToken'] as const,
  },
  subscription: {
    inviteUsers: () => ['subscription', 'inviteUsers'] as const,
    updateOrganizationRole: () => ['subscription', 'updateOrganizationRole'] as const,
  },
  server: {
    healthCheck: () => ['server', 'healthCheck'] as const,
  },
};

export default mutationKeys;
