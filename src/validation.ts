import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

export const configureValidation = (app: INestApplication) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
