import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './film.entity';
import { TmdbModule } from '../tmdb/tmdb.module';
import { UsersModule } from '../users/users.module';
import { FilmsReporitory } from './films.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity]), TmdbModule, UsersModule],
  providers: [FilmsService, FilmsReporitory],
  controllers: [FilmsController],
})
export class FilmsModule {}
