import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

// стратегия для защищенных контроллеров (которые должны обогащать объект запроста user-ом)
@Injectable() // чтобы инжектить описанные сервисы в AuthModule
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // чтоб считать заголовок с Bearer
      ignoreExpiration: false, // - нужно проверять срок действия токена (expiration)
      secretOrKey: configService.get<string>('jwt.secret'),
      // если ошибка с secret key - либо ошибка тут, либо в AuthModule #JwtStrategy requires a secret or key
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub); // если вместо sub писать id, присылает не того пользователя! (первого попавшегося)
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
