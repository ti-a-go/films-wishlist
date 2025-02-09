import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { Film, FilmData } from './film.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TmdbService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }

    async searchFilm(filmData: FilmData): Promise<Film> {
        const url = this.configService.get<string>('TMDB_ENDPOINT_SEARCH_FILM')

        const params = {
            query: filmData.title,
            language: filmData.language,
            primary_release_year: filmData.year,
        }

        const bearerToken = this.configService.get<string>('TMDB_ACCESS_TOKEN')

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
        };

        const { data } = await firstValueFrom(
            this.httpService.get(url!, { params, headers }).pipe(
                catchError((error: AxiosError) => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                    }
                    console.log(error.config);

                    throw 'An error happened when calling TMDB search film endpoint'
                })
            )
        )

        const { results } = data

        if (results.length) {
            return {
                title: results[0].original_title as string,
                language: results[0].original_language as string,
                synopse: results[0].overview as string,
                year: results[0].release_date.split('-')[0] as string
            }
        }

        return null
    }
}
