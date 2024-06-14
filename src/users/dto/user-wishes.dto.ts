import { OmitType } from '@nestjs/swagger';
import { Wish } from 'src/wishes/entities/wish.entity';

// исключаем поле owner из Wish
export class UserWishesDto extends OmitType(Wish, ['owner'] as const) {}
