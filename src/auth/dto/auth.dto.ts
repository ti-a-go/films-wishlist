import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
