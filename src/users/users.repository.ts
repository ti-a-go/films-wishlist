import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity) {
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error('ERROR - Failed to create user in the database.');
      this.logger.error(`ERROR - ${JSON.stringify(error)}`);

      throw new InternalServerErrorException();
    }
  }

  async findByName(name: string) {
    try {
      return await this.usersRepository.findOne({
        where: { name },
      });
    } catch (error) {
      this.logger.error(
        'Error while trying to find user by name on the database',
      );
      this.logger.error(`ERROR - ${JSON.stringify(error)}`);

      throw new InternalServerErrorException();
    }
  }
}
