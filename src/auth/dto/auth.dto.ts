import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
