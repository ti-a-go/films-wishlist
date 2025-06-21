import { Logger } from '@nestjs/common';
import { Settings } from './config/settings';

export class AppLogger {
  private nestLogger: Logger;

  constructor(name: string) {
    this.nestLogger = new Logger(name);
  }

  log(message: string) {
    if (!Settings.isTestEnv()) {
      this.nestLogger.log(message);
    }
  }

  error(message: string, stack?: string) {
    if (!Settings.isTestEnv()) {
      this.nestLogger.error(message, stack);
    }
  }
}
