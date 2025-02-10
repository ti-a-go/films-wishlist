import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserEntity } from './user.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<UserEntity>> = jest.fn(() => ({
  save: jest.fn(entity => entity),
  findOne: jest.fn(entity => entity),
}));

describe('UsersService', () => {
  let service: UsersService;
  let configService: ConfigService
  let repositoryMock: MockType<Repository<UserEntity>>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ]
    }).compile();


    service = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
    repositoryMock = module.get(getRepositoryToken(UserEntity));

    const useLogger = configService.get<string>('NEST_APP_USE_APP')

    if (useLogger === 'false') {
      module.useLogger(false)
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("createUser", () => {
    it('should throw when user repository throws', async () => {
      // Given
      const userData = new CreateUserDTO()
      userData.name = faker.internet.username()
      userData.password = faker.internet.password()

      repositoryMock.findOne.mockImplementation(() => Promise.resolve(null))
      repositoryMock.save.mockImplementation(() => Promise.reject(new Error()))

      const userToBeCreated = new UserEntity()
      userToBeCreated.name = userData.name
      userToBeCreated.password = userData.password

      const expecteFindOneParams = {
        where: { name: userData.name },
      }

      // Then
      expect(async () => await service.createUser(userData)).rejects.toThrow(InternalServerErrorException);
      expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, expecteFindOneParams);
    });
    
    it('should create a new user', async () => {
      // Given
      const userData = new CreateUserDTO()
      userData.name = faker.internet.username()
      userData.password = faker.internet.password()

      const mockUser = new UserEntity()
      mockUser.name = userData.name
      mockUser.password = userData.password
      mockUser.createdAt = faker.date.past().toDateString()
      mockUser.updatedAt = mockUser.createdAt

      repositoryMock.findOne.mockImplementation(async () => Promise.resolve(null))
      repositoryMock.save.mockImplementation(async () => Promise.resolve(mockUser))

      const userToBeCreated = new UserEntity()
      userToBeCreated.name = userData.name
      userToBeCreated.password = userData.password

      const expecteFindOneParams = {
        where: { name: userData.name },
      }

      // When
      const createdUser = await service.createUser(userData)

      // Then
      expect(createdUser).toEqual(mockUser);
      expect(repositoryMock.save).toHaveBeenNthCalledWith(1, userToBeCreated);
      expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, expecteFindOneParams);
    });
  })

  describe("findByName", () => {
    it('should throw user repository throws', async () => {
      // Given
      const username = faker.internet.username()

      repositoryMock.findOne.mockImplementation(() => Promise.reject(new Error()))

      const expectedFindOneParams = {
        where: { name: username },
      }

      // Then
      expect(async () => await service.findByName(username)).rejects.toThrow(InternalServerErrorException);
      expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, expectedFindOneParams);
    });
    
    it('should find a user by name', async () => {
      // Given
      const username = faker.internet.username()

      
      const foundUser = new UserEntity()
      foundUser.name = username

      repositoryMock.findOne.mockReturnValue(foundUser)

      const expectedFindOneParams = {
        where: { name: username },
      }

      // When
      const user = await service.findByName(username)

      // Then
      expect(user).toEqual(foundUser);
      expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, expectedFindOneParams);
    });
  })
});
