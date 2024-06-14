import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { ERR_MESSAGE } from 'src/utils/constants/error-messages';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, userId: number) {
    const itemId = dto.itemId.toString();

    // перед тем как создавать - находим пользователя и желание
    const user = await this.usersService.findById(userId);
    const item = await this.wishesService.findWishById(dto.itemId);

    const isSameUser = userId === item.owner.id; // жертвует на свой же подарок?
    if (isSameUser) {
      throw new BadRequestException(ERR_MESSAGE.FORBIDDEN_USER);
    }

    const offerIsTooMuch = dto.amount > item.price - item.raised; // пожертвование больше, чем остаток для сбора?
    if (offerIsTooMuch) {
      throw new BadRequestException(ERR_MESSAGE.SUM_IS_TOO_MUCH);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // массив промисов для транзакции
      const operations = [
        this.wishesService.updateRaised(dto.amount, itemId), // обновляем raised
        this.offersRepository.save({
          item,
          amount: dto.amount,
          hidden: dto.hidden,
          user,
        }), // создаем offer
      ];

      await Promise.all(operations);

      await queryRunner.commitTransaction();
      // return 'Удалось внести пожертвование';
    } catch (err) {
      await queryRunner.rollbackTransaction();

      // return 'НЕ удалось внести пожертвование';
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.offersRepository.find();
  }

  async findOne(id: string) {
    const numericId = Number(id);

    return await this.offersRepository.findOneOrFail({
      where: { id: numericId },
    });
  }
}
