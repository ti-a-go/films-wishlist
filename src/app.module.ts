import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { FilmsModule } from './films/films.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { TmdbModule } from './tmdb/tmdb.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalLoggerInterceptor } from './resources/interceptors/global-logger/global-logger.interceptor';
import { LogsModule } from './logs/logs.module';
import { LogEntity } from './logs/log.entity';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([LogEntity])
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalLoggerInterceptor,
    }
  ],
})
export class AppModule { }
