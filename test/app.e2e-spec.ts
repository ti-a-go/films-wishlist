import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { faker } from '@faker-js/faker/.';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationGuard } from './../src/auth/auth.guard';
import { UserEntity } from './../src/users/user.entity';

const canActivate = (context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  req.user = new UserEntity();
  return true;
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthenticationGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  describe('/films (POST)', () => {
    it('Should create a new user', () => {
      // Given
      const requestBody = {};

      const responseBody = {
        message: ['title should not be empty'],
        error: 'Bad Request',
        statusCode: 400,
      };

      // Then
      return request(app.getHttpServer())
        .post('/films')
        .send(requestBody)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(responseBody);
    });

    it('Should login and return a new token', () => {});
  });
});
