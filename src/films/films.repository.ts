import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmEntity } from './film.entity';
import { Repository } from 'typeorm';
import { Film } from './film.interface';

@Injectable()
export class FilmsRepository {
  private readonly logger = new Logger(FilmsRepository.name);

  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
  ) {}

  async findOneByTitleYearAndLanguage(
    title: string,
    year: string,
    language: string,
  ) {
    try {
      return await this.filmRepository.findOne({
        where: { title, year, language },
      });
    } catch (error) {
      this.logger.error(
        'An error happened while trying to find a film on the database',
      );
      this.logger.error(`ERROR - ${JSON.stringify(error)}`);
      this.logger.error(
        `filters - ${JSON.stringify({ title, year, language })}`,
      );

      throw new InternalServerErrorException();
    }
  }

  async save(film: Film) {
    try {
      return await this.filmRepository.save(film);
    } catch (error) {
      this.logger.error(
        'An error happened while trying to save a film on the database',
      );
      this.logger.error(`ERROR - ${JSON.stringify(error)}`);
      this.logger.error(`Film - ${JSON.stringify(film)}`);

      throw new InternalServerErrorException();
    }
  }
}
