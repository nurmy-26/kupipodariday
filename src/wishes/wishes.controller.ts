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
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @ApiOperation({ summary: 'Создание нового желания' })
  @UseGuards(JwtAuthGuard) // если не поставить гвард, будет падать ошибка Cannot read properties of undefined (reading 'id')
  @Post()
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
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

  @ApiOperation({ summary: 'Получение своего желания по id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@AuthUser() user: User, @Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findOne(id, user.id);
  }

  @ApiOperation({ summary: 'Обновление своего желания по id' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@AuthUser() user: User, @Param('id') id: string, @Body() dto: UpdateWishDto) {
    return await this.wishesService.update(id, dto, user.id);
  }

  @ApiOperation({ summary: 'Удаление своего желания по id' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@AuthUser() user: User, @Param('id') id: string): Promise<Wish> {
    return await this.wishesService.remove(id, user.id);
  }

  @ApiOperation({ summary: 'Копирование чужого желания по id' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@AuthUser() user: User, @Param('id') id: string) {
    return await this.wishesService.copy(id, user.id);
  }

  // пример с пагинацией
  @ApiOperation({ summary: 'Получение всех желаний' })
  @Get()
  async findAll(@Query() query: { page: number; limit: number }): Promise<WishPaginator> {
    console.log(query);

    return await this.wishesService.findAll(query);
  }
}
