import { Injectable } from '@nestjs/common';
import { Film, FilmQuery } from './film.interface';
import { CreateFilmeDTO } from './dto/CreateFilme.dto';
import { UserEntity } from '../users/user.entity';
import { TmdbService } from '../tmdb/tmdb.service';
import { UsersService } from '../users/users.service';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tmdbService: TmdbService,
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async addFilmToWishlist(userId: string, filmData: CreateFilmeDTO) {
    const existentFilm = await this.findFilm(filmData);

    let filmToBeCreaed: Film;
    let user: UserEntity;

    if (existentFilm) {
      user = await this.usersService.addFilmToUserWishlist(
        existentFilm,
        userId,
      );

      return user;
    } else {
      filmToBeCreaed = await this.tmdbService.searchFilm(filmData);
    }

    const createdFilm = await this.createFilm(filmToBeCreaed);

    return await this.usersService.addFilmToUserWishlist(createdFilm, userId);
  }

  async findFilm(filmData: FilmQuery) {
    return await this.filmsRepository.findOneByTitleYearAndLanguage(
      filmData.title.toUpperCase(),
      filmData.year,
      filmData.language,
    );
  }

  async createFilm(film: Film) {
    film.title = film.title.toUpperCase();
    return await this.filmsRepository.save(film);
  }
}
