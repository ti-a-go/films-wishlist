import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HashPasswordPipe } from '../resources/pipes/hash-password.pipe';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UsersService } from './users.service';
import { CreatedUserDTO } from './dto/CreatedUser.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthenticationGuard, RequestWithUser } from '../auth/auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user.' })
  @Post()
  async createUser(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() { password, ...userData }: CreateUserDTO,
    @Body('password', HashPasswordPipe) hashedPassword: string,
  ) {
    const createdUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return new CreatedUserDTO(createdUser.id, createdUser.name);
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
