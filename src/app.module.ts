import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalLoggerInterceptor } from './resources/interceptors/global-logger/global-logger.interceptor';
import { imports } from './app.module.imports';

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
  ],
})
export class AppModule {}
