import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotificationPayload } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly repository: NotificationRepository,
    private readonly gateway: NotificationGateway,
  ) {}

  async send(payload: NotificationPayload) {
    const notification = await this.repository.create(payload);
    this.gateway.sendToUser(payload.userId, notification);
    this.logger.log(`Notification sent to user ${payload.userId}: ${payload.title}`);
    return notification;
  }

  async getUserNotifications(userId: string, unreadOnly?: boolean) {
    return this.repository.findByUser(userId, unreadOnly);
  }

  async getUnreadCount(userId: string) {
    return this.repository.countUnread(userId);
  }

  async markRead(id: string) {
    return this.repository.markRead(id);
  }

  async markAllRead(userId: string) {
    await this.repository.markAllRead(userId);
    return true;
  }
}
