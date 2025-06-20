import { INestApplication } from '@nestjs/common';
import { Settings } from './config/settings';
import { SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = Settings.getSwaggerConfig();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
};
