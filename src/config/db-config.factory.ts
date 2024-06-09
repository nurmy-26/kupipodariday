import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { join } from "path";

@Injectable() // чтоб работал как сервис внутри TypeORM
export class DatabaseConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { } // инжектим ConfigService, чтоб был доступен в this
  createTypeOrmOptions(): TypeOrmModuleOptions {
      return {
        type: 'postgres',
        host: this.configService.get<string>('db.host'),
        port: this.configService.get<number>('db.port'),
        username: this.configService.get<string>('db.user'),
        password: this.configService.get<string>('db.pass'),
        database: this.configService.get<string>('db.name'),
        // entities: [join(__dirname, '../**/*.entity{.ts,.js}')], // сам найдет сущности по шаблону
        autoLoadEntities: this.configService.get<boolean>('autoLoadEntities'),
        synchronize: this.configService.get<boolean>('synchronize'),
      }
  }
}