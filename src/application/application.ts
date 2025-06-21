import { Injectable } from '@nestjs/common';
import { CreateFilmeDTO } from '../films/dto/CreateFilme.dto';
import { FilmsService } from '../films/films.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class Application {
  constructor(
    private readonly usersService: UsersService,
    private readonly tmdbService: TmdbService,
    private readonly filmsService: FilmsService,
  ) {}

  async addFilmToUserWishlist(user: UserEntity, filmData: CreateFilmeDTO) {
    const existentFilm = await this.filmsService.findFilm(filmData);

    if (existentFilm) {
      user = await this.usersService.addFilmToUserWishlist(
        existentFilm,
        userId,
      );

      return user;
    }

    const filmToBeCreaed = await this.tmdbService.searchFilm(filmData);

    const createdFilm = await this.filmsService.createFilm(filmToBeCreaed);

    return await this.usersService.addFilmToUserWishlist(createdFilm, userId);
  }

  async getUsersWishlit(userId: string) {
    const user = await this.usersService.findById(userId);

    return user.wisheslist
  }
}
