import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthUserId } from 'src/utils/decorators/user.decorator';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UserPublicResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    // тут получаем все сервисы, которые будем использовать в контроллере
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @ApiOperation({ summary: 'Получение текущего пользователя' })
  @Get('me')
  async findById(@AuthUserId() userId: User['id']): Promise<UserResponseDto> {
    return await this.usersService.findUserById(userId);
  }

  @ApiOperation({ summary: 'Получение желаний текущего пользователя' })
  @Get('me/wishes')
  async findSelfWishes(@AuthUserId() userId: User['id']): Promise<Wish[]> {
    return await this.wishesService.findWishesByOwnerId(userId);
  }

  @ApiOperation({ summary: 'Изменение текущего пользователя' })
  @Patch('me')
  async updateSelf(
    @AuthUserId() user: User,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { id } = user;
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Получение массива с пользователем' })
  @Post('find')
  async findMany(@Body() dto: FindUserDto): Promise<UserResponseDto[]> {
    return await this.usersService.findByUsernameOrEmail(dto);
  }

  @ApiOperation({ summary: 'Получение пользователя по username' })
  @Get(':username')
  async findUserByUsername(
    @Param('username') username: string,
  ): Promise<UserPublicResponseDto> {
    return await this.usersService.findByUsername(username);
  }

  @ApiOperation({ summary: 'Получение желаний пользователя' })
  @Get(':username/wishes')
  async findWishesByUsername(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    return await this.wishesService.findWishesByUsername(username);
  }
}
