import { Body, Controller, Post } from '@nestjs/common';
import { HashPasswordPipe } from '../resources/pipes/hash-password.pipe';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UsersService } from './users.service';
import { CreatedUserDTO } from './dto/CreatedUser.dto';

@Controller('/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(
    @Body() { password, ...userData }: CreateUserDTO,
    @Body('password', HashPasswordPipe) hashedPassword: string,
  ) {
    const createdUser = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return new CreatedUserDTO(createdUser.id, createdUser.name);
  }
}
