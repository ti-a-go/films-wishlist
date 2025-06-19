import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostgresConfigService } from './config/postgres.config.service';
import { FilmsModule } from './films/films.module';
import { TmdbModule } from './tmdb/tmdb.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistModule } from './wishlist/wishlist.module';
import { LogsModule } from './log/logs.module';
import { LogEntity } from './log/log.entity';

export const imports = [
  FilmsModule,
  TmdbModule,
  AuthModule,
  UsersModule,
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  TypeOrmModule.forRootAsync({
    useClass: PostgresConfigService,
    inject: [PostgresConfigService],
  }),
  WishlistModule,
  LogsModule,
  TypeOrmModule.forFeature([LogEntity]),
];
