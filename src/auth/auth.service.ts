import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export interface UserPayload {
  sub: string;
  username: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByName(username);

    if (user === null) {
      this.logger.log('User not found for authentication');
      this.logger.log(`User - ${username}`);

      throw new UnauthorizedException('Username or password incorrect.');
    }

    const isUserAuthenticated = await bcrypt.compare(password, user.password);

    if (!isUserAuthenticated) {
      this.logger.log('Password incorrect.');
      this.logger.log(`User - ${username}`);

      throw new UnauthorizedException('Username or password incorrect.');
    }

    const payload: UserPayload = {
      sub: user.id,
      username: user.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
