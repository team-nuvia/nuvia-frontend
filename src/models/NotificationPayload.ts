export interface NotificationPayload {
  id: number;
  title: string;
  content: string;
  fromId: number;
  toId: number;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
