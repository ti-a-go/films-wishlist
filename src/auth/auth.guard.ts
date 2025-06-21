import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/user.entity';

export interface RequestWithUser extends Request {
  user: UserEntity;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticationGuard.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const request = contexto.switchToHttp().getRequest<RequestWithUser>();

    const token = this.extractToken(request);

    if (!token) {
      this.logger.log('Authentication failed');
      this.logger.log(`ERROR - ${JSON.stringify(request.headers)}`);

      throw new UnauthorizedException('Authentication failed');
    }

    let payload: UserPayload;

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (error) {
      this.logger.error('Authentication error');
      this.logger.error(`ERROR - ${JSON.stringify(error)}`);

      throw new UnauthorizedException('Invalid Token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      this.logger.error('UsersService.findById(payload.sub) returned null');
      this.logger.error(`UserId: ${payload.sub}`);
      this.logger.error(`Username: ${payload.username}`);

      throw new InternalServerErrorException();
    } else {
      request.user = user;
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
