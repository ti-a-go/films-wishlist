import { faker } from '@faker-js/faker/.';
import { AuthService } from './auth.service';
import { Mocked, TestBed } from '@suites/unit';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: Mocked<UsersRepository>;
  let jwtService: Mocked<JwtService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

    service = unit;
    usersRepository = unitRef.get(UsersRepository);
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

      usersRepository.findByName.mockImplementation(() =>
        Promise.resolve(null),
      );

      // Then
      expect(
        async () => await service.login(username, password),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersRepository.findByName).toHaveBeenNthCalledWith(1, username);
    });

    it('should throw authentication exception when password is not correct', async () => {
      // Given
      const username = faker.internet.username();
      const wrongPassword = faker.internet.password();
      const correctPassword = faker.internet.password();

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(correctPassword, salt);

      const user = new UserEntity();
      user.password = hashedPassword;
      user.name = username;

      usersRepository.findByName.mockResolvedValue(user);

      // Then
      expect(
        async () => await service.login(username, wrongPassword),
      ).rejects.toThrow(UnauthorizedException);
      expect(usersRepository.findByName).toHaveBeenNthCalledWith(1, username);
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

      usersRepository.findByName.mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValue(expectedToken);

      // When
      const result = await service.login(username, password);

      // Then
      expect(result).toEqual(expectedResult);
    });
  });

  describe('register', () => {
    test('should throw when username already exists', () => {
      // Given
      const username = faker.internet.username();
      const password = faker.internet.password();

      usersRepository.findByName.mockImplementation(() =>
        Promise.resolve(new UserEntity()),
      );

      // Then
      expect(async () => {
        await service.register(username, password);
      }).rejects.toThrow(ConflictException);
      expect(usersRepository.findByName).toHaveBeenNthCalledWith(1, username);
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    test('should throw when user repository throws', () => {
      // Given
      const username = faker.internet.username();
      const password = faker.internet.password();

      usersRepository.findByName.mockImplementation(() =>
        Promise.reject(new Error()),
      );

      // Then
      expect(async () => {
        await service.register(username, password);
      }).rejects.toThrow(Error);
      expect(usersRepository.findByName).toHaveBeenNthCalledWith(1, username);
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    test('should create a new user and return the username', async () => {
      // Given
      const username = faker.internet.username();
      const password = faker.internet.password();
      const newUser = UserEntity.create(username, password);

      usersRepository.findByName.mockImplementation(() =>
        Promise.resolve(null),
      );
      usersRepository.save.mockImplementation(() => Promise.resolve(newUser));

      // When
      const result = await service.register(username, password);

      // Then
      expect(result.username).toBe(username);
      expect(usersRepository.findByName).toHaveBeenNthCalledWith(1, username);
      expect(usersRepository.save).toHaveBeenNthCalledWith(1, newUser);
    });
  });
});
