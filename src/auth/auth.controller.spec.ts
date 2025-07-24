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
      // When
      // Then
      expect(
        
      )
    });

    test('should return access token', () => {
      // Given
      // When
      // Then
    });
  });

  describe('register', () => {
    test('should throw when auth service throws', () => {
      // Given
      // When
      // Then
    });

    test('should return username', () => {
      // Given
      // When
      // Then
    });
  });
});
