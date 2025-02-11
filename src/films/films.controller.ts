import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FilmsService } from './films.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { Film } from './film.interface';
import { CreateFilmeDTO } from './dto/CreateFilme.dto';
import { AuthenticationGuard, RequestWithUser } from '../auth/auth.guard';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Controller('films')
export class FilmsController {
    constructor(
        private readonly filmService: FilmsService,
        private readonly tmdbService: TmdbService,
        private readonly usersService: UsersService,
    ) {}

    @UseGuards(AuthenticationGuard)
    @Post()
    async createFilm(
        @Body() filmData: CreateFilmeDTO,
        @Req() req: RequestWithUser
    ) {
        const existentFilm = await this.filmService.findFilm(filmData)
        
        let filmToBeCreaed: Film
        let user: UserEntity

        if (existentFilm) {
            user = await this.usersService.addFilmToUserWishlist(existentFilm, req.user.sub)

            return user;
        } else {
            filmToBeCreaed = await this.tmdbService.searchFilm(filmData)
        }
        
        const createdFilm = await this.filmService.createFilm(filmToBeCreaed)

        user = await this.usersService.addFilmToUserWishlist(createdFilm, req.user.sub)

        return user
    }
}
