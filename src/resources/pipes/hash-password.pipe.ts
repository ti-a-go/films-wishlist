import { Injectable, InternalServerErrorException, Logger, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  private readonly logger = new Logger(HashPasswordPipe.name);

  constructor(private configService: ConfigService) { }

  async transform(password: string) {
    const salt = this.configService.get<string>('SALT');

    if (!salt) {
      this.logger.error('Salt not found. Is SALT env variable set?')

      throw new InternalServerErrorException()
    }

    const senhaHasheada = await bcrypt.hash(password, salt);

    return senhaHasheada;
  }
}
