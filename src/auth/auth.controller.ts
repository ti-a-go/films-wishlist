import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Authenticate user and create authentication token.',
  })
  @Post('login')
  login(@Body() { username, password }: AuthDTO) {
    return this.authService.login(username, password);
  }
}
