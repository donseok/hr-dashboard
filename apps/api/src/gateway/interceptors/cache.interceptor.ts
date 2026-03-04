import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../../shared/cache/redis.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const key = this.buildCacheKey(context);
    if (!key) return next.handle();

    const cached = await this.redis.get(key);
    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.redis.set(key, data, 300);
      }),
    );
  }

  private buildCacheKey(context: ExecutionContext): string | null {
    const handler = context.getHandler();
    const className = context.getClass().name;
    return `cache:${className}:${handler.name}`;
  }
}
