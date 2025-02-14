import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, NotFoundError, of, retry, timer } from 'rxjs';
import { Film, FilmData } from './film.interface';
import { ConfigService } from '@nestjs/config';

interface Result {
  adult: boolean,
  backdrop_path: string,
  genre_ids: Array<number>,
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  popularity: number,
  poster_path: string,
  release_date: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number
}

interface Data {
  page: number,
  results: Array<Result>,
  total_pages: number,
  total_results: number
}

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }

  async searchFilm(filmData: FilmData): Promise<Film> {
    const url = this.configService.get<string>('TMDB_ENDPOINT_SEARCH_FILM');

    const params = {
      query: filmData.title,
      language: filmData.language,
      primary_release_year: filmData.year,
    };

    const bearerToken = this.configService.get<string>('TMDB_ACCESS_TOKEN');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    };

    this.logger.log(`HTTP Request GET - ${url}`);
    this.logger.log(`params - ${JSON.stringify(params)}`);

    const { data } = await firstValueFrom(
      this.httpService.get<Data>(url!, { params, headers }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(`HTTP error - GET ${url}`);
          this.logger.error(`params - ${JSON.stringify(params)}`);
          if (error.response) {
            this.logger.error(
              `Response Data - ${JSON.stringify(error.response.data)}`,
            );
            this.logger.error(
              `Response Status - ${JSON.stringify(error.response.status)}`,
            );
            this.logger.error(
              `Response Headers - ${JSON.stringify(error.response.headers)}`,
            );
          } else if (error.request) {
            this.logger.error(`Request - ${JSON.stringify(error.request)}`);
          } else {
            this.logger.error(`Message - ${JSON.stringify(error.message)}`);
          }

          this.logger.error(`Error config - ${JSON.stringify(error.config)}`);

          return of({ data: undefined });
        }),
      ),
    );

    if (data === undefined) {
      throw new Error('An error happened during TMDB API call.');
    }

    if (!data.results) {
      throw new Error('An error happened during TMDB API call.');
    }

    if (data.results.length) {
      const film = {
        title: data.results[0].original_title as string,
        language: data.results[0].original_language as string,
        synopse: data.results[0].overview as string,
        year: data.results[0].release_date.split('-')[0] as string,
      };

      this.logger.log(`Film found on TMDB - ${film.title}`);
      this.logger.log(`Year - ${film.year}`);
      this.logger.log(`Language - ${film.language}`);
      this.logger.log(`Synopse - ${film.synopse.split('.')[0]}`);

      return film;
    }

    throw new NotFoundException(`Could not find ${filmData.title} on TMDB's API.`);
  }
}
