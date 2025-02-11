import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmEntity } from './film.entity';
import { Repository } from 'typeorm';
import { Film, FilmQuery } from './film.interface';

@Injectable()
export class FilmsService {
    constructor(
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>
    ) { }

    async findFilm(filmData: FilmQuery) {

        const foundFilm = await this.filmRepository.findOne({
            where: {
                title: filmData.title.toUpperCase(),
                year: filmData.year,
                language: filmData.language
            }
        });
        
        return foundFilm;
    }

    async createFilm(film: Film) {
        film.title = film.title.toUpperCase()

        return await this.filmRepository.save(film)
    }
}
