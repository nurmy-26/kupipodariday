import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SigninUserResponseDto } from './dto/access-token.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard) // local исп-ся только в этом месте (при регистрации)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('signin')
  login(@AuthUser() user: User): Promise<SigninUserResponseDto> {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.signup(createUserDto);

    return user;
  }
}
