import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly kafka: Kafka;
  private producer: Producer;
  private consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('kafka.clientId'),
      brokers: this.configService.get<string[]>('kafka.brokers') || ['localhost:9092'],
      ssl: this.configService.get<boolean>('kafka.ssl'),
    });
    this.producer = this.kafka.producer();
  }

  async connectProducer(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async publish(topic: string, message: { key?: string; value: unknown }): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.key,
          value: JSON.stringify(message.value),
        },
      ],
    });
  }

  async subscribe(
    topic: string,
    groupId: string,
    handler: (payload: EachMessagePayload) => Promise<void>,
  ): Promise<void> {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });
    await consumer.run({ eachMessage: handler });
    this.consumers.push(consumer);
    this.logger.log(`Subscribed to topic: ${topic}`);
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
    this.logger.log('Kafka disconnected');
  }
}
