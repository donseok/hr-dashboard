export const NOTIFICATION_RECEIVED_SUBSCRIPTION = /* GraphQL */ `
  subscription NotificationReceived {
    notificationReceived {
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
