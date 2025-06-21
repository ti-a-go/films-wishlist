import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthenticationGuard, RequestWithUser } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'List all films in the wishlist of the user.' })
  @Get()
  @UseGuards(AuthenticationGuard)
  async getWishlist(@Req() req: RequestWithUser) {
    return this.usersService.getWishlist(req.user);
  }
}
