export const MARK_NOTIFICATION_READ_MUTATION = /* GraphQL */ `
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      isRead
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = /* GraphQL */ `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;
