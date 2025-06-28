import { DocumentBuilder } from '@nestjs/swagger';

export class Settings {
  static getSwaggerPath() {
    return process.env.SWAGGER_PATH ?? 'api';
  }

  static isTestEnv() {
    return process.env.NODE_ENV === 'test';
  }

  static getSwaggerConfig() {
    return new DocumentBuilder()
      .setTitle('Films Wishlist')
      .setDescription('API to manage your films wishlist.')
      .setVersion('1.0')
      .addTag('films')
      .build();
  }

  static getPort() {
    return process.env.PORT ?? 3000;
  }
}
