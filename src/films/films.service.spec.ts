import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { faker } from '@faker-js/faker/.';
import { FilmEntity } from './film.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<FilmEntity>> = jest.fn(() => ({
  findOne: jest.fn(entity => entity),
}));

describe('FilmsService', () => {
  let service: FilmsService;
  let repositoryMock: MockType<Repository<FilmEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: getRepositoryToken(FilmEntity), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repositoryMock = module.get(getRepositoryToken(FilmEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a film in the database', async () => {
    // Given
    const filmData = {
      title: faker.lorem.words(),
      language: faker.location.language().name,
      year: faker.number.int().toString(),
    }

    const query = {
      where: {
        title: filmData.title.toUpperCase(),
        year: filmData.year,
        language: filmData.language
      }
    }

    const mockFilm = new FilmEntity()
    mockFilm.id = faker.string.uuid()
    mockFilm.title = filmData.title
    mockFilm.language = filmData.language
    mockFilm.year = filmData.year
    mockFilm.synopse = faker.lorem.paragraph()
    mockFilm.createdAt = faker.date.past().toString()
    mockFilm.updatedAt = faker.date.recent().toString()

    repositoryMock.findOne.mockReturnValue(mockFilm)

    // When
    const foundFilm = await service.findFilm(filmData)

    // Then
    expect(foundFilm).toBeInstanceOf(FilmEntity);
    expect(foundFilm).toEqual(mockFilm)
    expect(repositoryMock.findOne).toHaveBeenNthCalledWith(1, query);
  });
});
