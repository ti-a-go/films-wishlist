import { Repository } from 'typeorm';
import { FilmEntity } from './film.entity';
import { FilmsRepository } from './films.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<FilmEntity>> =
  jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }));

describe('FilmsRepository', () => {
  let repository: FilmsRepository;
  let typeOrmRepository: MockType<Repository<FilmEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsRepository,
        {
          provide: getRepositoryToken(FilmEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    repository = module.get<FilmsRepository>(FilmsRepository);
    typeOrmRepository = module.get(getRepositoryToken(FilmEntity));
  });

  describe('findOneByTitleYearAndLanguage', () => {
    it('Should find a film', async () => {
      // Given
      const title = faker.lorem.words();
      const year = faker.number.int().toString();
      const language = faker.lorem.words();

      const mockFilm = new FilmEntity();
      mockFilm.title = title;
      mockFilm.year = year;
      mockFilm.language = language;
      mockFilm.createdAt = faker.date.past().toDateString();
      mockFilm.updatedAt = mockFilm.createdAt;
      mockFilm.id = faker.string.uuid();
      mockFilm.synopse = faker.lorem.paragraph();

      typeOrmRepository.findOne.mockImplementation(() =>
        Promise.resolve(mockFilm),
      );

      const expectedParams = {
        where: { title, year, language },
      };

      // When
      const film = await repository.findOneByTitleYearAndLanguage(
        title,
        year,
        language,
      );

      // Then
      expect(film).toEqual(mockFilm);
      expect(typeOrmRepository.findOne).toHaveBeenNthCalledWith(
        1,
        expectedParams,
      );
    });

    it('Should not find a film', async () => {
      // Given
      const title = faker.lorem.words();
      const year = faker.number.int().toString();
      const language = faker.lorem.words();

      typeOrmRepository.findOne.mockImplementation(() => Promise.resolve(null));

      const expectedParams = {
        where: { title, year, language },
      };

      // When
      const film = await repository.findOneByTitleYearAndLanguage(
        title,
        year,
        language,
      );

      // Then
      expect(film).toBeNull;
      expect(typeOrmRepository.findOne).toHaveBeenNthCalledWith(
        1,
        expectedParams,
      );
    });

    it('Should throw', async () => {
      // Given
      const title = faker.lorem.words();
      const year = faker.number.int().toString();
      const language = faker.lorem.words();

      typeOrmRepository.findOne.mockImplementation(() =>
        Promise.reject(new Error()),
      );

      const expectedParams = {
        where: { title, year, language },
      };

      // Then
      expect(
        async () =>
          await repository.findOneByTitleYearAndLanguage(title, year, language),
      ).rejects.toThrow(Error);
      expect(typeOrmRepository.findOne).toHaveBeenNthCalledWith(
        1,
        expectedParams,
      );
    });
  });

  describe('save', () => {
    it('Should save a film', async () => {
      // Given
      const filmToBeCreated = {
        title: faker.lorem.words(),
        year: faker.number.int().toString(),
        language: faker.lorem.words(),
        synopse: faker.lorem.paragraph(),
      };

      const createdFilm = new FilmEntity();
      createdFilm.title = filmToBeCreated.title;
      createdFilm.year = filmToBeCreated.year;
      createdFilm.language = filmToBeCreated.language;
      createdFilm.synopse = filmToBeCreated.synopse;
      createdFilm.id = faker.string.uuid();
      createdFilm.createdAt = faker.date.past().toDateString();
      createdFilm.updatedAt = createdFilm.createdAt;

      typeOrmRepository.save.mockImplementation(() =>
        Promise.resolve(createdFilm),
      );

      // When
      const film = await repository.save(filmToBeCreated);

      // Then
      expect(film).toEqual(createdFilm);
      expect(typeOrmRepository.save).toHaveBeenNthCalledWith(
        1,
        filmToBeCreated,
      );
    });

    it('Should throw', async () => {
      // Given
      const filmToBeCreated = {
        title: faker.lorem.words(),
        year: faker.number.int().toString(),
        language: faker.lorem.words(),
        synopse: faker.lorem.paragraph(),
      };

      typeOrmRepository.save.mockImplementation(() =>
        Promise.reject(new Error()),
      );

      // Then
      expect(
        async () => await repository.save(filmToBeCreated),
      ).rejects.toThrow(Error);
      expect(typeOrmRepository.save).toHaveBeenNthCalledWith(
        1,
        filmToBeCreated,
      );
    });
  });
});
