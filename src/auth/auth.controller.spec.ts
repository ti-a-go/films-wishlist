import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TestBed, Mocked } from '@suites/unit';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Mocked<AuthService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthController).compile();

    controller = unit;
    authService = unitRef.get(AuthService);
  });

  test('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    test('should throw when auth service throws', () => {
      // Given
      const username = 'username';
      const password = 'password';

      authService.login.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_username: string, _password: string) => {
          return Promise.reject(new Error());
        },
      );

      // Then
      expect(async () =>
        controller.login({ username, password }),
      ).rejects.toThrow(Error);
    });

    test('should return access token', async () => {
      // Given
      const username = 'username';
      const password = 'password';
      const token = 'token';

      authService.login.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_username: string, _password: string) => {
          return Promise.resolve({ access_token: token });
        },
      );

      // When
      const result = await controller.login({ username, password });

      // Then
      expect(result.access_token).toBe(token);
    });
  });

  describe('register', () => {
    test('should throw when auth service throws', () => {
      // Given
      const username = 'username';
      const password = 'password';
      const hashedPassword = 'hashedPassword';

      authService.register.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_username: string, _password: string) => {
          return Promise.reject(new Error());
        },
      );

      // Then
      expect(async () =>
        controller.register({ username, password }, hashedPassword),
      ).rejects.toThrow(Error);
    });

    test('should return username', async () => {
      // Given
      const username = 'username';
      const password = 'password';
      const hashedPassword = 'hashedPassword';

      authService.register.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_username: string, _password: string) => {
          return Promise.resolve({ username });
        },
      );

      // When
      const result = await controller.register(
        { username, password },
        hashedPassword,
      );

      // Then
      expect(result.username).toBe(username);
    });
  });
});
