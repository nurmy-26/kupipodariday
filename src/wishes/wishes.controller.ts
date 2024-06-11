import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WishPaginator, WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiOperation({ summary: 'Создание нового желания' })
  @Post()
  @UseGuards(JwtAuthGuard) // если не поставить гвард, будет падать ошибка Cannot read properties of undefined (reading 'id')
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @ApiOperation({ summary: 'Получение всех желаний' })
  @Get()
  async findAll(@Query() query: { page: number; limit: number }): Promise<WishPaginator> {
    console.log(query);

    return await this.wishesService.findAll(query);
  }
}
