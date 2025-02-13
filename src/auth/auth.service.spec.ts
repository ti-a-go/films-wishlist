import { faker } from '@faker-js/faker/.';
import { AuthService } from './auth.service';
import { Mocked, TestBed } from '@suites/unit';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Mocked<UsersService>;
  let jwtService: Mocked<JwtService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

    service = unit;
    usersService = unitRef.get(UsersService);
    jwtService = unitRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw authentication exception when user is not found', async () => {
      // Given
      const username = faker.internet.username();
      const password = faker.internet.password();

      usersService.findByName.mockReturnValue(null);

      // Then
      expect(
        async () => await service.login(username, password),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByName).toHaveBeenNthCalledWith(1, username);
    });

    it('should throw authentication exception when username password is not correct', async () => {
      // Given
      const username = faker.internet.username();
      const wrongPassword = faker.internet.password();
      const correctPassword = faker.internet.password();

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(correctPassword, salt);

      const user = new UserEntity();
      user.password = hashedPassword;
      user.name = username;

      usersService.findByName.mockResolvedValue(user);

      // Then
      expect(
        async () => await service.login(username, wrongPassword),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersService.findByName).toHaveBeenNthCalledWith(1, username);
    });

    it('should return JWT token', async () => {
      // Given
      const username = faker.internet.username();
      const password = faker.internet.password();

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new UserEntity();
      user.id = faker.string.uuid();
      user.password = hashedPassword;
      user.name = username;

      const expectedToken = faker.internet.jwt();

      const expectedResult = {
        access_token: expectedToken,
      };

      usersService.findByName.mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValue(expectedToken);

      // When
      const result = await service.login(username, password);

      // Then
      expect(result).toEqual(expectedResult);
    });
  });
});
