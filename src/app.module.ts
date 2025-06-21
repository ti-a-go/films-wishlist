import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalLoggerInterceptor } from './http/interceptors/global-logger.interceptor';
import { imports } from './app.module.imports';
import { Application } from './application/application';
import { ApplicationModule } from './application/application.module';

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
  imports: [ApplicationModule],
})
export class AppModule {}
