import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthUserId } from 'src/utils/decorators/user.decorator';
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
  ) {}

  @UseGuards(LocalAuthGuard) // local исп-ся только в этом месте (при регистрации)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('signin')
  login(
    @AuthUserId() user,
    @Body() signinUserDto: SigninUserDto
  ): Promise<SigninUserResponseDto> {
    console.log(user);

    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  // @ApiResponse({ status: 201, type: UserResponseDto }) - вместо этого указывать возвращаемый тип
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.signup(createUserDto);

    return user;
  }
}
