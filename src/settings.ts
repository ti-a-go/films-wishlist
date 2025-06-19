import { DocumentBuilder } from '@nestjs/swagger';

export class Settings {
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
