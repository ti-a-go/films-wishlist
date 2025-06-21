import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { FilmEntity } from '../films/film.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { Status, WishEntity } from '../wishlist/wish.entity';
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

  async addFilmToUserWishlist(film: FilmEntity, userId: string) {
    const user = await this.usersRepository.findUserWithWishlist(userId);

    if (user === null) {
      this.logger.error('Could not find user to add film to wishlist.');

      throw new NotFoundException('User not found.');
    }

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

    return await this.usersRepository.save(user);
  }

  async updateWishStatus(userId: string, filmId: string) {
    const user = await this.usersRepository.findUserWithWishlist(userId);

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
        'Film alread watched. To rate the film use the endpoint: PUT /rates.',
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

    return this.usersRepository.save(user);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }
}
