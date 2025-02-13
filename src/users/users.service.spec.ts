import { faker } from '@faker-js/faker/.';
import { InternalServerErrorException } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserEntity } from './user.entity';
import { Mocked, TestBed } from '@suites/unit';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Mocked<UsersRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersService).compile();

    service = unit;
    usersRepository = unitRef.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw when user repository throws', async () => {
      // Given
      const userData = new CreateUserDTO();
      userData.name = faker.internet.username();
      userData.password = faker.internet.password();

      usersRepository.findByName.mockImplementation(() =>
        Promise.resolve(null),
      );
      usersRepository.save.mockImplementation(() =>
        Promise.reject(new InternalServerErrorException()),
      );

      const userToBeCreated = new UserEntity();
      userToBeCreated.name = userData.name;
      userToBeCreated.password = userData.password;

      const expecteFindOneParams = userData.name;

      // Then
      expect(async () => await service.createUser(userData)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(usersRepository.findByName).toHaveBeenNthCalledWith(
        1,
        expecteFindOneParams,
      );
    });

    it('should create a new user', async () => {
      // Given
      const userData = new CreateUserDTO();
      userData.name = faker.internet.username();
      userData.password = faker.internet.password();

      const mockUser = new UserEntity();
      mockUser.name = userData.name;
      mockUser.password = userData.password;
      mockUser.createdAt = faker.date.past().toDateString();
      mockUser.updatedAt = mockUser.createdAt;

      usersRepository.findByName.mockImplementation(async () =>
        Promise.resolve(null),
      );
      usersRepository.save.mockImplementation(async () =>
        Promise.resolve(mockUser),
      );

      const userToBeCreated = new UserEntity();
      userToBeCreated.name = userData.name;
      userToBeCreated.password = userData.password;

      const expecteFindOneParams = userData.name;

      // When
      const createdUser = await service.createUser(userData);

      // Then
      expect(createdUser).toEqual(mockUser);
      expect(usersRepository.save).toHaveBeenNthCalledWith(1, userToBeCreated);
      expect(usersRepository.findByName).toHaveBeenNthCalledWith(
        1,
        expecteFindOneParams,
      );
    });
  });
});
