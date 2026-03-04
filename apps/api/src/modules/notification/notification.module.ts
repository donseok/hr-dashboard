import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationRepository } from './notification.repository';

@Module({
  providers: [NotificationService, NotificationGateway, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
