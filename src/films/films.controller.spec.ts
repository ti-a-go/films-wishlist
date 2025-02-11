import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { Mocked, TestBed } from '@suites/unit';
import { UsersService } from '../users/users.service';
import { FilmsService } from './films.service';
import { TmdbService } from '../tmdb/tmdb.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let usersService: Mocked<UsersService>;
  let filmsService: Mocked<FilmsService>;
  let tmdbService: Mocked<TmdbService>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(FilmsController).compile();

    controller = unit;
    usersService = unitRef.get(UsersService);
    filmsService = unitRef.get(FilmsService);
    tmdbService = unitRef.get(TmdbService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
