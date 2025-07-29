import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticationGuard } from './auth.guard';
import { TestBed } from '@suites/unit';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(async () => {
    const { unit } = await TestBed.solitary(AuthenticationGuard).compile();

    guard = unit;
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
  });
});
