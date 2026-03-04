import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

// Config
import {
  appConfig,
  databaseConfig,
  redisConfig,
  kafkaConfig,
  jwtConfig,
  graphqlConfig,
} from './config';

// Shared modules
import { DatabaseModule } from './shared/database/database.module';
import { CacheModule } from './shared/cache/cache.module';
import { MessagingModule } from './shared/messaging/messaging.module';
import { SearchModule } from './shared/search/search.module';
import { AuditModule } from './shared/audit/audit.module';

// Gateway
import { DateScalar } from './gateway/scalars/date.scalar';
import { JsonScalar } from './gateway/scalars/json.scalar';
import { RequestLoggingMiddleware } from './gateway/middleware/request-logging.middleware';

// Domain modules
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { WorkforceModule } from './modules/workforce/workforce.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
import { PerformanceModule } from './modules/performance/performance.module';
import { CultureModule } from './modules/culture/culture.module';
import { DevelopmentModule } from './modules/development/development.module';
import { DeiModule } from './modules/dei/dei.module';
import { LifecycleModule } from './modules/lifecycle/lifecycle.module';
import { NotificationModule } from './modules/notification/notification.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { KpiModule } from './modules/kpi/kpi.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, kafkaConfig, jwtConfig, graphqlConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // GraphQL
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        typePaths: [join(__dirname, '**/*.gql')],
        playground: configService.get<boolean>('graphql.playground'),
        introspection: configService.get<boolean>('graphql.introspection'),
        path: configService.get<string>('graphql.path'),
        context: ({ req, connection }: { req: unknown; connection?: { context: unknown } }) =>
          connection ? { req: connection.context } : { req },
        subscriptions: {
          'graphql-ws': true,
        },
      }),
    }),

    // Shared
    DatabaseModule,
    CacheModule,
    MessagingModule,
    SearchModule,
    AuditModule,

    // Domain
    AuthModule,
    WorkforceModule,
    RecruitmentModule,
    PerformanceModule,
    CultureModule,
    DevelopmentModule,
    DeiModule,
    LifecycleModule,
    NotificationModule,
    IntegrationModule,
    KpiModule,
  ],
  providers: [
    DateScalar,
    JsonScalar,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
