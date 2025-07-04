import { INestApplication, ValidationPipe } from '@nestjs/common';

export const configurePipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};
