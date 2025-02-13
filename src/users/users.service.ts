import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { FilmEntity } from '../films/film.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { Status, WishEntity } from '../wishlist/wish.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userData: CreateUserDTO): Promise<UserEntity> {
    const user = await this.findByName(userData.name);

    if (user) {
      this.logger.log('Username already exists');
      this.logger.log(`USERNAME - ${userData.name}`);

      throw new ConflictException('Username already exists');
    }

    const userEntity = new UserEntity();

    Object.assign(userEntity, userData as UserEntity);

    let createdUser: UserEntity;

    try {
      createdUser = await this.userRepository.save(userEntity);
    } catch (error) {
      this.logger.error('ERROR - Failed to create user in the database.');
      this.logger.error(`ERROR - ${JSON.stringify(error)}`);

      throw new InternalServerErrorException();
    }

    return createdUser;
  }

  async findByName(name: string) {
    let user: UserEntity;

    try {
      user = await this.userRepository.findOne({
        where: { name },
      });
    } catch (error) {
      this.logger.error('Error while trying to find user on the database');
      this.logger.error(`ERROR - ${JSON.stringify(error)}`);

      throw new InternalServerErrorException();
    }

    return user;
  }

  async findUserWithWishlist(userId) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        wishlist: {
          wishes: {
            film: true,
          },
        },
      },
    });

    return user;
  }

  async addFilmToUserWishlist(film: FilmEntity, userId: string) {
    let user = await this.findUserWithWishlist(userId);

    if (!user.wishlist) {
      user.wishlist = new WishlistEntity();
      user.wishlist.wishes = [];
    }

    if (user.wishlist.wishes?.length > 0) {
      const existentWish = user.wishlist.wishes.find((wish) => {
        if (wish.film.title === film.title) {
          return true;
        }
      });

      if (existentWish) {
        return user;
      }
    }

    const wish = new WishEntity();
    wish.film = film;

    user.wishlist.wishes.push(wish);

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async updateWishStatus(userId: string, filmId: string) {
    const user = await this.findUserWithWishlist(userId);

    if (!user) {
      this.logger.log('User not found.');

      return new NotFoundException('User not found.');
    }

    if (!user.wishlist) {
      this.logger.log('No wisheslist found in the user.');

      throw new NotFoundException('Film not found.');
    }

    if (!user.wishlist.wishes) {
      this.logger.log('No whishes found in the user.');

      throw new NotFoundException('Film not found.');
    }

    if (user.wishlist.wishes.length < 1) {
      this.logger.log('Whishes list has no wish.');

      throw new NotFoundException('Film not found.');
    }

    const foundWish = user.wishlist.wishes.find((wish) => {
      if (wish.film.id === filmId) {
        return true;
      }
    });

    if (!foundWish) {
      this.logger.log('No wishes found in the user.');

      throw new NotFoundException('Film not found.');
    }

    if (foundWish.status === Status.WATCHED) {
      throw new BadRequestException(
        'Film alread watched. To rate the film user PUT /rate endpoint.',
      );
    }

    if (foundWish.status === Status.RATED) {
      throw new BadRequestException(
        'Film alread rated. To recommend the film user PUT /recommend endpoint.',
      );
    }

    foundWish.updateStatus();

    user.wishlist.wishes = user.wishlist.wishes.map((wish) => {
      if (wish.id === foundWish.id) {
        return foundWish;
      }
      return wish;
    });

    this.userRepository.save(user);

    return user;
  }
}
