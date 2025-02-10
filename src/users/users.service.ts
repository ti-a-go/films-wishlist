import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  createUser(userData: CreateUserDTO): UserEntity {
    const userEntity = new UserEntity();

    Object.assign(userEntity, userData as UserEntity);

    let createdUser;

    try {
      createdUser = this.userRepository.create(userEntity);
    } catch (error) {
      this.logger.error('ERROR - Failed to create user in the database.')
      this.logger.error(`ERROR - ${JSON.stringify(error)}`)

      throw new InternalServerErrorException()
    }

    return createdUser
  }

  async findByName(name: string) {
    let user: UserEntity;

    try {
      
      user = await this.userRepository.findOne({
        where: { name },
      });

    } catch (error) {

      this.logger.error('Error while trying to find user on the database')
      this.logger.error(`ERROR - ${JSON.stringify(error)}`)
      
      throw new InternalServerErrorException()
    }
    

    if (user === null)
      throw new NotFoundException('User not found.');

    return user;
  }
}
