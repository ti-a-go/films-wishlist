import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './film.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmEntity]),
  ],
  providers: [
    FilmsService,
  ],
  controllers: [FilmsController]
})
export class FilmsModule {}
