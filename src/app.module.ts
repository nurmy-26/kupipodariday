import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DatabaseConfigFactory } from './config/db-config.factory';
import { configSchema } from './config/joi-schema';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController, AuthController],
  providers: [AppService],
  imports: [
    // логирование
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    // подключение конфигурации
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      load: [configuration],
    }),
    // подключение к базе данных
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigFactory,
    }),
    // подключение остальных модулей
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
})
export class AppModule {}
