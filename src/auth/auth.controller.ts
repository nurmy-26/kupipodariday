import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { instanceToPlain } from 'class-transformer';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SigninUserResponseDto } from './dto/access-token.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 201, type: SigninUserResponseDto })
  @UseGuards(LocalAuthGuard) // local исп-ся только в этом месте (при регистрации)
  @Post('signin')
  login(
    @AuthUser() user,
    @Body() signinUserDto: SigninUserDto
  ): Promise<any> {
    console.log(user);

    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.signup(createUserDto);
    console.log(user);

    return instanceToPlain(user); // { password, ...user }
    // для преобразования экземпляра класса в обычный объект JavaScript
  }
}
