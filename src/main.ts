import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './swagger';
import { Settings } from './config/settings';
import { configurePipes } from './pipes';
import { configureValidation } from './validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureSwagger(app);

  configurePipes(app);

  configureValidation(app);

  await app.listen(Settings.getPort());
}
bootstrap();
