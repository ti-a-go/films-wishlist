import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { HashPasswordPipe } from '../http/pipes/hash-password.pipe';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Authenticate user and create authentication token.',
  })
  @Post('login')
  async login(@Body() { username, password }: AuthDTO) {
    this.logger.log(
      `Starting auth controller: login endpoint. Username: ${username}`,
    );

    return await this.authService.login(username, password);
  }

  @Post('register')
  async register(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() { username, password }: AuthDTO,
    @Body('password', HashPasswordPipe) hashedPassword: string,
  ) {
    this.logger.log(
      `Starting auth controller: register endpoint. Username: ${username}`,
    );

    return await this.authService.register(username, hashedPassword);
  }
}
