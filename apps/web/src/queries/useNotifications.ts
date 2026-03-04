'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { gqlRequest } from '@/lib/graphql-client';
import { queryKeys } from './query-keys';
import { onSocketEvent, type NotificationEvent } from '@/lib/socket-client';
import {
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
} from '@/graphql/mutations/notification';

const NOTIFICATIONS_QUERY = /* GraphQL */ `
  query Notifications($unreadOnly: Boolean) {
    notifications(unreadOnly: $unreadOnly) {
      id
      type
      title
      message
      link
      isRead
      createdAt
    }
  }
`;

const UNREAD_COUNT_QUERY = /* GraphQL */ `
  query UnreadNotificationCount {
    unreadNotificationCount
  }
`;

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications(unreadOnly = false) {
  const queryClient = useQueryClient();

  // Subscribe to real-time notification events
  useEffect(() => {
    const unsub = onSocketEvent('notification', (_data: NotificationEvent) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    });
    return unsub;
  }, [queryClient]);

  return useQuery({
    queryKey: queryKeys.notifications.list(unreadOnly),
    queryFn: async () => {
      const data = await gqlRequest<{
        notifications: Notification[];
      }>(NOTIFICATIONS_QUERY, { unreadOnly });
      return data.notifications;
    },
    staleTime: 30 * 1000,
  });
}

export function useUnreadCount() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsub = onSocketEvent('notification', () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(),
      });
    });
    return unsub;
  }, [queryClient]);

  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const data = await gqlRequest<{ unreadNotificationCount: number }>(
        UNREAD_COUNT_QUERY,
      );
      return data.unreadNotificationCount;
    },
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return gqlRequest<{ markNotificationRead: Notification }>(
        MARK_NOTIFICATION_READ_MUTATION,
        { id },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return gqlRequest<{ markAllNotificationsRead: boolean }>(
        MARK_ALL_NOTIFICATIONS_READ_MUTATION,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
