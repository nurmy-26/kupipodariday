import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local"; // важен импорт именно из этой библиотеки для local
import { ERR_MESSAGE } from "src/utils/constants/error-messages";
import { AuthService } from "../auth.service";

// стратегия, которая обрабатывает первоначальное создание пользователя
// либо возвращает пользователя в то место, где вызывается метод, либо отклоняет (выбрасывает искл-е)
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor( private authService: AuthService ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException(ERR_MESSAGE.INVALID_AUTH)
    }
    return user;
  }
}