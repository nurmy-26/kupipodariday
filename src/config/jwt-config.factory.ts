import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfigFactory implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}
  createJwtOptions(): JwtModuleOptions {
      return {
        // если ошибка с secret key - либо ошибка тут, либо в jwt.strategy #JwtStrategy requires a secret or key
        secret: this.configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: this.configService.get<string>('jwt.ttl'),
        }
      }
  }
}