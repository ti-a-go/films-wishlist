import { Test, TestingModule } from '@nestjs/testing';
import { TmdbService } from './tmdb.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker/.';


describe('TmdbService', () => {
  let service: TmdbService;
  let httpService: HttpService
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmdbService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        HttpModule.register({
          timeout: 5000,
          maxRedirects: 5
        })
      ]
    }).compile();

    service = module.get<TmdbService>(TmdbService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("", () => {
    it('should search for a film on TMDB\'s API', async () => {
      // Setup
      const tmdbSearchFilmEndpoint = configService.get<string>('TMDB_ENDPOINT_SEARCH_FILM')

    const tmdbResponseData = {
      "page": 1,
      "results": [
        {
          "adult": false,
          "backdrop_path": "/sC0b8iPUHfZdD8kseLiHw3N8gkp.jpg",
          "genre_ids": [
            27,
            53
          ],
          "id": 458723,
          "original_language": "en",
          "original_title": "Us",
          "overview": "Husband and wife Gabe and Adelaide Wilson take their kids to their beach house expecting to unplug and unwind with friends. But as night descends, their serenity turns to tension and chaos when some shocking visitors arrive uninvited.",
          "popularity": 24.978,
          "poster_path": "/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg",
          "release_date": "2019-03-14",
          "title": "Us",
          "video": false,
          "vote_average": 6.966,
          "vote_count": 7404
        }
      ],
      "total_pages": 248,
      "total_results": 4945
    }

      const response: AxiosResponse = {
        data: tmdbResponseData,
        headers: {},
        config: {
          url: tmdbSearchFilmEndpoint,
          headers: {} as AxiosRequestHeaders
        },
        status: 200,
        statusText: 'OK',
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(response));

      // Given
      const film = {
        title: faker.lorem.words(),
        language: faker.location.language().name,
        year: faker.number.int().toString(),
      }

      // When
      const foundFilm = await service.searchFilm(film)

      // Then
      const expectedFoundFilm = {
        title: tmdbResponseData.results[0].original_title as string,
        language: tmdbResponseData.results[0].original_language as string,
        synopse: tmdbResponseData.results[0].overview as string,
        year: tmdbResponseData.results[0].release_date.split('-')[0] as string
      }

      const expectedRequestParams = {
        query: film.title,
        language: film.language,
        primary_release_year: film.year,
      }

      const tmdbApiToken = configService.get<string>('TMDB_ACCESS_TOKEN')
      const expectedRequestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tmdbApiToken}`,
      };

      expect(foundFilm).toEqual(expectedFoundFilm);
      expect(httpService.get).toHaveBeenNthCalledWith(1, tmdbSearchFilmEndpoint, { params: expectedRequestParams, headers: expectedRequestHeaders });
    });

    it('should return null when search on TBMD\'s API does not return any film', async () => {
      // Setup
      const tmdbSearchFilmEndpoint = configService.get<string>('TMDB_ENDPOINT_SEARCH_FILM')

      const tmdbResponseData = {
        "page": 1,
        "results": [],
        "total_pages": 1,
        "total_results": 0
      }

      const response: AxiosResponse = {
        data: tmdbResponseData,
        headers: {},
        config: {
          url: tmdbSearchFilmEndpoint,
          headers: {} as AxiosRequestHeaders
        },
        status: 200,
        statusText: 'OK',
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(response));

      // Given
      const film = {
        title: faker.lorem.words(),
        language: faker.location.language().name,
        year: faker.number.int().toString(),
      }

      // When
      const foundFilm = await service.searchFilm(film)

      // Then
      const expectedFoundFilm = null

      const expectedRequestParams = {
        query: film.title,
        language: film.language,
        primary_release_year: film.year,
      }

      const tmdbApiToken = configService.get<string>('TMDB_ACCESS_TOKEN')
      const expectedRequestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tmdbApiToken}`,
      };

      expect(foundFilm).toEqual(expectedFoundFilm);
      expect(httpService.get).toHaveBeenNthCalledWith(1, tmdbSearchFilmEndpoint, { params: expectedRequestParams, headers: expectedRequestHeaders });
    });

    it('should return throw when TMDB\s API return BAD_REQUEST', async () => {
      // Setup
      const tmdbSearchFilmEndpoint = configService.get<string>('TMDB_ENDPOINT_SEARCH_FILM')

      const config = {
        url: "http://localhost:3000",
        headers: {} as AxiosRequestHeaders
      };

      const axiosError = new AxiosError('HTTP error', 'CONNECTION_ERROR', config, {}, {
        status: 400,
        data: undefined,
        statusText: "BAD_REQUEST",
        config,
        headers: {}
      })

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => axiosError));


      // Given
      const film = {
        title: faker.lorem.words(),
        language: faker.location.language().name,
        year: faker.number.int().toString(),
      }

      // Then
      expect(async () => { await service.searchFilm(film) }).rejects.toThrow(Error);
    });

    it('should retry when TMDB\s API return INTERNAL_SERVER_ERROR', async () => {
      // Setup
      const tmdbSearchFilmEndpoint = configService.get<string>('TMDB_ENDPOINT_SEARCH_FILM')

      const config = {
        url: "http://localhost:3000",
        headers: {} as AxiosRequestHeaders
      };

      const axiosError = new AxiosError('HTTP error', 'CONNECTION_ERROR', config, {}, {
        status: 500,
        data: undefined,
        statusText: "INTERNAL_SERVER_ERROR",
        config,
        headers: {}
      })

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => axiosError));


      // Given
      const film = {
        title: faker.lorem.words(),
        language: faker.location.language().name,
        year: faker.number.int().toString(),
      }

      // Then
      expect(async () => { await service.searchFilm(film) }).rejects.toThrow(Error);
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });
  })
});
