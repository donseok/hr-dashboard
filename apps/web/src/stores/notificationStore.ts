import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  moduleId?: string;
  actionUrl?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set(
          (state) => {
            const newNotification: Notification = {
              ...notification,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              isRead: false,
            };
            return {
              notifications: [newNotification, ...state.notifications].slice(0, 100),
              unreadCount: state.unreadCount + 1,
            };
          },
          false,
          'addNotification',
        ),
      markAsRead: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((n) => n.id === id && !n.isRead) ? 1 : 0)),
          }),
          false,
          'markAsRead',
        ),
      markAllAsRead: () =>
        set(
          (state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
          }),
          false,
          'markAllAsRead',
        ),
      removeNotification: (id) =>
        set(
          (state) => {
            const removed = state.notifications.find((n) => n.id === id);
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: removed && !removed.isRead ? state.unreadCount - 1 : state.unreadCount,
            };
          },
          false,
          'removeNotification',
        ),
      clearAll: () =>
        set({ notifications: [], unreadCount: 0 }, false, 'clearAll'),
    }),
    { name: 'notification-store' },
  ),
);
