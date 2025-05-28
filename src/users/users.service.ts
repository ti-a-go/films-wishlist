import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(userData: CreateUserDTO): Promise<UserEntity> {
    const user = await this.usersRepository.findByName(userData.name);

    if (user) {
      this.logger.log('Username already exists');
      this.logger.log(`USERNAME - ${userData.name}`);

      throw new ConflictException('Username already exists');
    }

    const userEntity = new UserEntity();

    Object.assign(userEntity, userData as UserEntity);

    return await this.usersRepository.save(userEntity);
  }
}
