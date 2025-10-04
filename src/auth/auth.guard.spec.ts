import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticationGuard } from './auth.guard';
import { Mocked, TestBed } from '@suites/unit';
import { faker } from '@faker-js/faker/.';
import { JwtService } from '@nestjs/jwt';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let jwtService: Mocked<JwtService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(AuthenticationGuard).compile();

    guard = unit;
    jwtService = unitRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should throw request does not have the authentication token', async () => {
      // Given
      const contextMock = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: '',
            },
          }),
        }),
      };

      // Then
      expect(async () => {
        await guard.canActivate(contextMock as ExecutionContext);
      }).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when JwtService throws', async () => {
      // Given
      const token = faker.internet.jwt();
      const contextMock = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer ' + token,
            },
          }),
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      jwtService.verifyAsync.mockImplementationOnce((_token: string) => {
        return Promise.reject(new Error());
      });

      // Then
      expect(async () => {
        await guard.canActivate(contextMock as ExecutionContext);
      }).rejects.toThrow(UnauthorizedException);
      expect(jwtService.verifyAsync).toHaveBeenNthCalledWith(1, token);
    });

    it('should return true', async () => {
      // Given
      const token = faker.internet.jwt();
      const contextMock = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer ' + token,
            },
          }),
        }),
      };

      const userPayload = {
        sub: faker.string.uuid(),
        username: faker.internet.username(),
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      jwtService.verifyAsync.mockImplementationOnce((_token: string) => {
        return Promise.resolve(userPayload);
      });

      // When
      const canActivate = await guard.canActivate(
        contextMock as ExecutionContext,
      );

      // Then
      expect(canActivate).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenNthCalledWith(1, token);
    });
  });
});
