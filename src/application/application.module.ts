import { Module } from '@nestjs/common';
import { Application } from './application';

@Module({
  providers: [Application],
})
export class ApplicationModule {}
