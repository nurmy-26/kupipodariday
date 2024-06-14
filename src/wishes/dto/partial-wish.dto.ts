import { PartialType, OmitType } from '@nestjs/swagger';
import { Wish } from '../entities/wish.entity';

// исключаем поля owner и offers из Wish и делаем остальные необязательными
export class PartialWish extends PartialType(
  OmitType(Wish, ['owner', 'offers'] as const),
) {}
