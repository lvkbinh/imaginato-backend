import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { CustomLoggerModule } from './shared/modules/custom-logger/custom-logger.module';
import { HealthCheckModule } from './shared/modules/health-check/health-check.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { DatabaseModule } from './shared/modules/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ArticlesModule } from './business/articles/articles.module';
import { CommentsModule } from './business/comments/comments.module';

@Module({
  imports: [
    // Shared Modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig
      ]
    }),
    CustomLoggerModule,
    HealthCheckModule,
    DatabaseModule,

    // Business Modules
    ArticlesModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
  ],
})
export class AppModule {}