import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed, Mocked } from '@suites/unit';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { faker } from '@faker-js/faker/.';
import { UserEntity } from './user.entity';
import { CreatedUserDTO } from './dto/CreatedUser.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Mocked<UsersService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersController).compile();

    controller = unit;
    usersService = unitRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    // Given
    const createUserDTO = new CreateUserDTO()
    createUserDTO.name = faker.internet.username()
    createUserDTO.password = faker.internet.password()

    const hashedPassword = faker.number.bigInt().toString()

    const mockCreatedUser = new UserEntity()
    mockCreatedUser.id = faker.string.uuid()
    mockCreatedUser.name = createUserDTO.name
    mockCreatedUser.password = hashedPassword
    mockCreatedUser.createdAt = faker.date.recent().toDateString()
    mockCreatedUser.updatedAt = mockCreatedUser.createdAt

    const expectedCreatedUser = new CreatedUserDTO(mockCreatedUser.id, mockCreatedUser.name)

    usersService.createUser.mockResolvedValue(mockCreatedUser)

    const expectedCreateUserParams = {
      ...createUserDTO,
      password: hashedPassword
    }

    // When
    const createdUser = await controller.createUser(createUserDTO, hashedPassword)

    // Then
    expect(createdUser).toEqual(expectedCreatedUser);
    expect(usersService.createUser).toHaveBeenNthCalledWith(1, expectedCreateUserParams)
  });
});
