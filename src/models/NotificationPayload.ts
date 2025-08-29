import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { NotificationType } from '@share/enums/notification-type';

export interface NotificationPayload {
  id: number;
  title: string;
  content: string;
  fromId: number;
  toId: number;
  isRead: boolean;
  referenceId: number | null;
  actionStatus: NotificationActionStatus | null;
  type: NotificationType;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
