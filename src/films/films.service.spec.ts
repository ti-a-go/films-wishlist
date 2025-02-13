import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { faker } from '@faker-js/faker/.';
import { FilmEntity } from './film.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mocked, TestBed } from '@suites/unit';
import { UsersService } from '../users/users.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { FilmsRepository } from './films.repository';


describe('FilmsService', () => {
  let service: FilmsService;

  let usersService: Mocked<UsersService>;
  let tmdbService: Mocked<TmdbService>;
  let filmsRepository: Mocked<FilmsRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(FilmsService).compile();

    service = unit;
    usersService = unitRef.get(UsersService);
    tmdbService = unitRef.get(TmdbService);
    filmsRepository = unitRef.get(FilmsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should find a film in the database', async () => {
  //   // Given
  //   const filmData = {
  //     title: faker.lorem.words(),
  //     language: faker.location.language().name,
  //     year: faker.number.int().toString(),
  //   }

  //   const query = {
  //     where: {
  //       title: filmData.title.toUpperCase(),
  //       year: filmData.year,
  //       language: filmData.language
  //     }
  //   }

  //   const mockFilm = new FilmEntity()
  //   mockFilm.id = faker.string.uuid()
  //   mockFilm.title = filmData.title
  //   mockFilm.language = filmData.language
  //   mockFilm.year = filmData.year
  //   mockFilm.synopse = faker.lorem.paragraph()
  //   mockFilm.createdAt = faker.date.past().toString()
  //   mockFilm.updatedAt = faker.date.recent().toString()

  //   repositoryMock.findOne.mockReturnValue(mockFilm)

  //   // When
  //   const foundFilm = await service.findFilm(filmData)

  //   // Then
  //   expect(foundFilm).toBeInstanceOf(FilmEntity);
  //   expect(foundFilm).toEqual(mockFilm)
  //   expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, query);
  // });
});
