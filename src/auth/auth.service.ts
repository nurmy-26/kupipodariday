import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from 'src/utils/helpers/hash';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    if (!username || !password) {
      throw new Error('Имя и пароль должны быть предоставлены');
    }

    const user = await this.usersService.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      }
    });

    const isVerified = await verifyHash(password, user.password);
    if (user && isVerified) {
      const { password, ...res } = user;
      return res;
    }

    return null;
  }

  async login(user: User): Promise<any> {
    const { username, id: sub } = user; // id переименовано согласно док-и
    const token = await this.jwtService.signAsync({ username, sub });

    return {
      access_token: token,
    }
  }
}
