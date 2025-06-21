import { Logger } from '@nestjs/common';

export class AppLogger {
  private nestLogger: Logger;

  constructor(name: string) {
    this.nestLogger = new Logger(name);
  }

  log(message: string) {
    this.nestLogger.log(message);
  }
}
