import { Module } from '@nestjs/common';
import { FilmsModule } from './films/films.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { TmdbModule } from './tmdb/tmdb.module';

@Module({
  imports: [
    FilmsModule,
    TmdbModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
