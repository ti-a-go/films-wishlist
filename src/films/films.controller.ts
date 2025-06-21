import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateFilmeDTO } from './dto/CreateFilme.dto';
import { AuthenticationGuard, RequestWithUser } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';
import { ApiOperation } from '@nestjs/swagger';
import { Application } from '../application/application';

@Controller('films')
export class FilmsController {
  constructor(
    private readonly application: Application,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: "Add film to user's wishlist." })
  @UseGuards(AuthenticationGuard)
  @Post()
  async createFilm(
    @Body() filmData: CreateFilmeDTO,
    @Req() req: RequestWithUser,
  ) {
    return await this.application.addFilmToUserWishlist(req.user, filmData);
  }

  @ApiOperation({
    summary: "Change the status of a film in the user's wishlist.",
  })
  @UseGuards(AuthenticationGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') filmId: string, @Req() req: RequestWithUser) {
    return this.usersService.updateWishStatus(req.user.sub, filmId);
  }
}
