import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  clientId: process.env.KAFKA_CLIENT_ID || 'hr-dashboard-api',
  groupId: process.env.KAFKA_GROUP_ID || 'hr-dashboard-group',
  ssl: process.env.KAFKA_SSL === 'true',
}));
