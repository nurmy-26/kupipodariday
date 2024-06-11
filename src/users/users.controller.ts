import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

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
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Get('me')
  async findSelf(@AuthUser() user: User): Promise<User> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  @ApiOperation({ summary: 'Получение желаний текущего пользователя' })
  @Get('me/wishes')
  async findSelfWishes(@AuthUser() user: User): Promise<Wish[]> {
    return await this.wishesService.findWishById(user.id);
  }

  @ApiOperation({ summary: 'Изменение текущего пользователя' })
  @ApiResponse({ status: 200, type: UpdateUserDto })
  @Patch('me')
  async updateSelf(@AuthUser() user: User, @Body() dto: UpdateUserDto) {
    const { id } = user;
    return this.usersService.update(id, dto);
  }
}
