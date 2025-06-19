import {
  Injectable,
  InternalServerErrorException,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  private readonly logger = new Logger(HashPasswordPipe.name);

  constructor(private configService: ConfigService) {}

  transform(password: string) {
    this.logger.log('Starting...');

    const salt = this.configService.get<string>('SALT');

    if (!salt) {
      this.logger.error('Salt not found. Is SALT env variable set?');

      throw new InternalServerErrorException();
    }

    this.logger.log('Hashing password...');

    let senhaHasheada: string | undefined;

    try {
      senhaHasheada = bcrypt.hashSync(password, salt);
    } catch (error) {
      this.logger.error('Error while hashing password', error);

      throw new InternalServerErrorException('Internal Server Error');
    }

    if (!senhaHasheada) {
      this.logger.error(`Hashed password null or undefined: ${senhaHasheada}`);

      throw new InternalServerErrorException('Internal Server Error');
    }

    this.logger.log(`Hashed password: ${senhaHasheada}`);

    return senhaHasheada;
  }
}
