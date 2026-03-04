import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isGraphQL = !!GqlExecutionContext.create(context).getInfo();
    if (isGraphQL) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
