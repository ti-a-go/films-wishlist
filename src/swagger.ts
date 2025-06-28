import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { Settings } from './config/settings';

export const configureSwagger = (app: INestApplication) => {
  const config = Settings.getSwaggerConfig();
  const path = Settings.getSwaggerPath();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, documentFactory);
};
