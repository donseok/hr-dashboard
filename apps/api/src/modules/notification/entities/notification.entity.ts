export interface NotificationPayload {
  userId: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'ACTION_REQUIRED';
  title: string;
  message: string;
  link?: string;
}
