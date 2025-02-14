import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;
}
