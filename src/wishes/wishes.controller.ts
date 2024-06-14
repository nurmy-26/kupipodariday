import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishPaginator, WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthUserId } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiOperation({ summary: 'Создание нового желания' })
  @UseGuards(JwtAuthGuard) // если не поставить гвард, будет падать ошибка Cannot read properties of undefined (reading 'id')
  @Post()
  create(@Body() createWishDto: CreateWishDto, @AuthUserId() userId: User["id"]) {
    return this.wishesService.create(createWishDto, userId);
  }

  @ApiOperation({ summary: 'Получение последних 40 желаний' })
  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    // по дате создания
    return await this.wishesService.getLastWishes();
  }

  @ApiOperation({ summary: 'Получение 20 наиболее популярных желаний' })
  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    // по числу копий
    return await this.wishesService.getTopWishes();
  }

  @ApiOperation({ summary: 'Получение желания по id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findWishById(id);
  }

  @ApiOperation({ summary: 'Обновление своего желания по id' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@AuthUserId() userId: User["id"], @Param('id') id: string, @Body() dto: UpdateWishDto) {
    return await this.wishesService.update(id, dto, userId);
  }

  @ApiOperation({ summary: 'Удаление своего желания по id' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@AuthUserId() userId: User["id"], @Param('id') id: string): Promise<Wish> {
    return await this.wishesService.remove(id, userId);
  }

  @ApiOperation({ summary: 'Копирование желания по id' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@AuthUserId() userId: User["id"], @Param('id') id: string) {
    return await this.wishesService.copy(id, userId);
  }
}
