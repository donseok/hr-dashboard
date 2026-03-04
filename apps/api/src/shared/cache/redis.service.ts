import { Injectable, Logger } from '@nestjs/common';

@Injectable()
  export class RedisService {
    private readonly logger = new Logger(RedisService.name);
    private readonly store = new Map<string, { value: string; expiresAt?: number }>();

  getClient(): this {
        return this;
  }

  async get<T>(key: string): Promise<T | null> {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
                this.store.delete(key);
                return null;
        }
        return JSON.parse(entry.value) as T;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
        this.store.set(key, {
                value: JSON.stringify(value),
                expiresAt: ttl ? Date.now() + ttl * 1000 : undefined,
        });
  }

  async del(key: string): Promise<void> {
        this.store.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
        const regex = new RegExp(pattern.replace('*', '.*'));
        for (const key of this.store.keys()) {
                if (regex.test(key)) this.store.delete(key);
        }
  }
}
