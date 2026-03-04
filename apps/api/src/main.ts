import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './gateway/filters/http-exception.filter';
import { TransformInterceptor } from './gateway/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './gateway/interceptors/timeout.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 4000;
  const corsOrigin = configService.get<string>('app.corsOrigin') || 'http://localhost:3000';

  // CORS
  app.enableCors({
    origin: corsOrigin.split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(30000),
  );

  // API prefix
  const apiPrefix = configService.get<string>('app.apiPrefix');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix, { exclude: ['graphql', 'health'] });
  }

  await app.listen(port);
  logger.log(`Application running on port ${port}`);
  logger.log(`GraphQL playground: http://localhost:${port}/graphql`);
}

bootstrap();
