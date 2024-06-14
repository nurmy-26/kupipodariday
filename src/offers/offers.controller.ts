import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { AuthUserId } from 'src/utils/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiOperation({ summary: 'Создание нового пожертвования' })
  @Post()
  async create(@Body() dto: CreateOfferDto, @AuthUserId() userId: User["id"], @Res() res: Response) {
    await this.offersService.create(dto, userId);
    res.status(201).json({});
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
