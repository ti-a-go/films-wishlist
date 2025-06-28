import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalLoggerInterceptor } from './http/interceptors/global-logger.interceptor';
import { imports } from './app.module.imports';
import { Application } from './application/application';

@Module({
  imports,
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalLoggerInterceptor,
    },
    Application,
  ],
})
export class AppModule {}
