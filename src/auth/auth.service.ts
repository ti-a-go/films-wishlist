import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { UserEntity } from 'src/users/user.entity';

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

    const isUserAuthenticated = bcrypt.compareSync(password, user.password);

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

  async register(username: string, password: string) {
    const userExists = await this.userRepository.findByName(username);

    if (userExists) {
      this.logger.log(`Username (${username}) already exists.`);

      throw new ConflictException('Username already exists.');
    }

    const newUser = UserEntity.create(username, password);

    const user = await this.userRepository.save(newUser);

    return {
      username: user.name,
    };
  }
}
