import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GqlExceptionFilterImpl implements GqlExceptionFilter {
  private readonly logger = new Logger(GqlExceptionFilterImpl.name);

  catch(exception: unknown, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message = typeof response === 'string' ? response : (response as Record<string, unknown>).message;

      this.logger.warn(`GraphQL Error: ${status} - ${message}`);

      return new GraphQLError(message as string, {
        extensions: {
          code: this.getErrorCode(status),
          statusCode: status,
        },
      });
    }

    this.logger.error('Unexpected error', exception);
    return new GraphQLError('Internal server error', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case 401: return 'UNAUTHENTICATED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 400: return 'BAD_REQUEST';
      case 409: return 'CONFLICT';
      default: return 'INTERNAL_SERVER_ERROR';
    }
  }
}
