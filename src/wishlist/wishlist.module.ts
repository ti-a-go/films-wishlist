import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [],
  controllers: [WishlistController],
  imports: [UsersModule],
})
export class WishlistModule {}
