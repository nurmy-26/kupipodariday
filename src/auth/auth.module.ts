import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtConfigFactory } from 'src/config/jwt-config.factory';

@Module({
  imports: [
    PassportModule, // чтоб заработали стратегии
    JwtModule.registerAsync({ // аналог TypeORM.forRootAsync
      useClass: JwtConfigFactory,
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtConfigFactory],
  exports: [AuthService]
})
export class AuthModule {}
