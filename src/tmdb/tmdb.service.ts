import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, of, retry, timer } from 'rxjs';
import { Film, FilmData } from './film.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
      this.httpService.get(url!, { params, headers }).pipe(
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

    let results = null;
    if (data.results) {
      results = data.results;
    }

    if (results.length) {
      const film = {
        title: results[0].original_title as string,
        language: results[0].original_language as string,
        synopse: results[0].overview as string,
        year: results[0].release_date.split('-')[0] as string,
      };

      this.logger.log(`Film found on TMDB - ${film.title}`);
      this.logger.log(`Year - ${film.year}`);
      this.logger.log(`Language - ${film.language}`);
      this.logger.log(`Synopse - ${film.synopse.split('.')[0]}`);

      return film;
    }

    return null;
  }
}
