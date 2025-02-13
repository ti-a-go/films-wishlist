import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';

export interface UserPayload {
  sub: string;
  username: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepository.findByName(username);

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
