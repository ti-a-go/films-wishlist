import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { FilmEntity } from '../films/film.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { WishEntity } from '../wishlist/wish.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async createUser(userData: CreateUserDTO): Promise<UserEntity> {
    const user = await this.findByName(userData.name)

    if (user) {
      this.logger.log('Username already exists')
      this.logger.log(`USERNAME - ${userData.name}`)

      throw new ConflictException('Username already exists')
    }

    const userEntity = new UserEntity();

    Object.assign(userEntity, userData as UserEntity);

    let createdUser: UserEntity;

    try {
      createdUser = await this.userRepository.save(userEntity);

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

    return user;
  }

  async findUserWithWishlist(userId) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        wishlist: {
          wishes: {
            film: true
          }
        }
      }
    })
    
    return user
  }

  async addFilmToUserWishlist(film: FilmEntity, userId: string) {
    let user = await this.findUserWithWishlist(userId)

    if (!user.wishlist) {
      user.wishlist = new WishlistEntity()
      user.wishlist.wishes = []
    }

    if (user.wishlist.wishes?.length > 0) {
      const existentWish = user.wishlist.wishes.find((wish) => {
        if (wish.film.title === film.title) {
          return true
        }
      })

      if (existentWish) {
        return user
      }
    }

    const wish = new WishEntity()
    wish.film = film

    user.wishlist.wishes.push(wish)

    const savedUser = await this.userRepository.save(user)

    return savedUser
  }
}
