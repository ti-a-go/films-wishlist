import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './film.entity';
import { TmdbModule } from 'src/tmdb/tmdb.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmEntity]),
    TmdbModule,
    UsersModule
  ],
  providers: [
    FilmsService,
  ],
  controllers: [FilmsController],
})
export class FilmsModule {}
