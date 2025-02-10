import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;
}
