export const AppEventType = {
  NOTIFICATION_RELOAD: 'NOTIFICATION_RELOAD',
  NOTIFICATION_READ: 'NOTIFICATION_READ',
} as const;
export type AppEventType = (typeof AppEventType)[keyof typeof AppEventType];

export type AppEvent = { type: AppEventType };
