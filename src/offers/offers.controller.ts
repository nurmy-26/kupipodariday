import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { AuthUser } from 'src/utils/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @ApiOperation({ summary: 'Создание нового пожертвования' })
  @Post()
  async create(@Body() dto: CreateOfferDto, @AuthUser() user: User) {
    return await this.offersService.create(dto, user.id)
  }

  @ApiOperation({ summary: 'Получение всех пожертвований' })
  @Get()
  async findAll(): Promise<Offer[]> {
    return await this.offersService.findAll();
  }

  @ApiOperation({ summary: 'Получение пожертвования по id' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Offer> {
    return await this.offersService.findOne(id);
  }
}
