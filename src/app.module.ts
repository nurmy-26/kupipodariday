import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DatabaseConfigFactory } from './config/db-config.factory';
import { configSchema } from './config/joi-schema';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    // подключение конфигурации
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      load: [configuration],
    }),
    // подключение базы данных
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigFactory
    }),
    // подключение остальных модулей
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
})
export class AppModule { }
