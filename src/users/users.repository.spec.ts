import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

export type MockType<T> = {
  findOne: jest.Mock<{}>;
  save: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<UserEntity>> =
  jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }));

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let typeOrmRepository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    typeOrmRepository = module.get(getRepositoryToken(UserEntity));
  });

  describe('save', () => {
    it('Should save a user', async () => {
      // Given
      const userToBeSaved = new UserEntity();
      userToBeSaved.name = faker.internet.username();
      userToBeSaved.password = faker.internet.password();

      const expectedUser = new UserEntity();
      expectedUser.id = faker.string.uuid();
      expectedUser.createdAt = faker.date.past().toDateString();
      expectedUser.updatedAt = expectedUser.createdAt;
      expectedUser.name = userToBeSaved.name;
      expectedUser.password = userToBeSaved.password;

      typeOrmRepository.save.mockImplementation(() =>
        Promise.resolve(expectedUser),
      );

      // When
      const user = await repository.save(userToBeSaved);

      // Then
      expect(user).toEqual(expectedUser);
      expect(typeOrmRepository.save).toHaveBeenNthCalledWith(1, userToBeSaved);
    });

    it('Should throw', () => {
      // Given
      const userToBeSaved = new UserEntity();
      userToBeSaved.name = faker.internet.username();
      userToBeSaved.password = faker.internet.password();

      typeOrmRepository.save.mockImplementation(() =>
        Promise.reject(new Error()),
      );

      // Then
      expect(async () => await repository.save(userToBeSaved)).rejects.toThrow(
        Error,
      );
      expect(typeOrmRepository.save).toHaveBeenNthCalledWith(1, userToBeSaved);
    });
  });

  describe('findByName', () => {
    it('Should find a user', async () => {
      // Given
      const name = faker.internet.username();

      const expectedUser = new UserEntity();
      expectedUser.id = faker.string.uuid();
      expectedUser.createdAt = faker.date.past().toDateString();
      expectedUser.updatedAt = expectedUser.createdAt;
      expectedUser.name = name;
      expectedUser.password = faker.internet.password();

      typeOrmRepository.findOne.mockImplementation(() =>
        Promise.resolve(expectedUser),
      );

      const expectedParams = {
        where: { name },
      };

      // When
      const user = await repository.findByName(name);

      // Then
      expect(user).toEqual(expectedUser);
      expect(typeOrmRepository.findOne).toHaveBeenNthCalledWith(
        1,
        expectedParams,
      );
    });

    it('Should not find a user', async () => {
      // Given
      const name = faker.internet.username();

      typeOrmRepository.findOne.mockImplementation(() => Promise.resolve(null));

      const expectedParams = {
        where: { name },
      };

      // When
      const user = await repository.findByName(name);

      // Then
      expect(user).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenNthCalledWith(
        1,
        expectedParams,
      );
    });

    it('Should throw', () => {
      // Given
      const name = faker.internet.username();

      typeOrmRepository.findOne.mockImplementation(() =>
        Promise.reject(new Error()),
      );

      const expectedParams = {
        where: { name },
      };

      // Then
      expect(async () => await repository.findByName(name)).rejects.toThrow(
        Error,
      );
      expect(typeOrmRepository.findOne).toHaveBeenNthCalledWith(
        1,
        expectedParams,
      );
    });
  });
});
