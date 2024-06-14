import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AuthUserId } from 'src/utils/decorators/user.decorator';
import { Wishlist } from './entities/wishlist.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('wishlistlists')
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiOperation({ summary: 'Создание нового вишлиста' })
  @Post()
  async create(
    @AuthUserId() userId: User['id'],
    @Body() dto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(userId, dto);
  }

  @ApiOperation({ summary: 'Получение всех вишлистов' })
  @Get()
  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll();
  }

  @ApiOperation({ summary: 'Получение вишлиста по id' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wishlist> {
    return await this.wishlistsService.findById(id);
  }

  @ApiOperation({ summary: 'Изменение своего вишлиста по id' })
  @Patch(':id')
  async update(
    @AuthUserId() userId: User['id'],
    @Param('id') id: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.update(id, dto, userId);
  }

  @ApiOperation({ summary: 'Удаление своего вишлиста по id' })
  @Delete(':id')
  async remove(
    @AuthUserId() userId: User['id'],
    @Param('id') id: string,
  ): Promise<Wishlist> {
    return await this.wishlistsService.remove(id, userId);
  }
}
