import { Injectable, Logger } from '@nestjs/common';

@Injectable()
  export class KafkaService {
    private readonly logger = new Logger(KafkaService.name);

  async connectProducer(): Promise<void> {
        this.logger.log('[Mock] Kafka producer connected');
  }

  async publish(topic: string, message: { key?: string; value: unknown }): Promise<void> {
        this.logger.log(`[Mock] Kafka publish to ${topic}: ${JSON.stringify(message.value)}`);
  }

  async subscribe(
        topic: string,
        groupId: string,
        handler: (payload: unknown) => Promise<void>,
      ): Promise<void> {
        this.logger.log(`[Mock] Kafka subscribed to ${topic} with group ${groupId}`);
  }

  async onModuleDestroy() {
        this.logger.log('[Mock] Kafka disconnected');
  }
}
