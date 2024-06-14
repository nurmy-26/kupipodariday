import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ERR_MESSAGE } from 'src/utils/constants/error-messages';
import { ASC, DESC, LAST_WISHES, TOP_WISHES } from 'src/utils/constants/data-base';

export type WishPaginator = {
  data: Wish[];
  page: number;
  siz: number;
  totalCount: number;
  totalPage: number;
}

@Injectable()
export class WishesService {
  private readonly logger = new Logger(WishesService.name);
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly usersService: UsersService // инжектим UsersService, так как инжектить репозиторий другого модуля плохая практика
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    // перед тем как создавать - находим пользователя
    const owner = await this.usersService.findById(userId);
    const wish = this.wishRepository.create({ ...createWishDto, owner });

    return this.wishRepository.save(wish);
  }

  async findWishById(wishId: number | string) {
    if (typeof wishId === 'string') {
      wishId = Number(wishId);
    }
    return await this.wishRepository.findOneOrFail({
      where: {id: wishId },
      relations: ['owner']
    })
  }

  async findAllByIds(wishesIdList: number[]) {
    let res: Wish[] = [];
    for (let i = 0; i < wishesIdList.length - 1; i++) {
      const wish = await this.wishRepository.findOneOrFail({
        where: { id: wishesIdList[i] },
        // order: { copied: ASC },
        relations: ['owner', 'offers']
      })
      res.push(wish);
    }
    return res;
  }

  // увеличение поля raised на offerValue
  async updateRaised(offerValue: number, wishId: string) {
    const numericId = Number(wishId);
    if (isNaN(numericId)) {
      throw new BadRequestException(ERR_MESSAGE.INVALID_DATA);
    }

    const wish = await this.wishRepository.findOneOrFail({
      where: { id: numericId },
    });

    return await this.wishRepository.save({
      ...wish,
      raised: wish.raised + offerValue,
    });
  }

  async getLastWishes() {
    // сортировка по полю даты создания
    return await this.wishRepository.find({
      order: { createdAt: DESC },
      take: LAST_WISHES,
      relations: ['owner', 'offers']
    })
  }

  async getTopWishes() {
    // сортировка по полю copied
    return await this.wishRepository.find({
      order: { copied: DESC },
      take: TOP_WISHES,
      relations: ['owner', 'offers']
    })
  }

  // метод для исп-я в других методах (поиск по СВОИМ подаркам)
  async findOwnerWishById(
    id: string,
    userId: number
  ) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(ERR_MESSAGE.INVALID_DATA);
    }

    const wish = await this.wishRepository.findOneOrFail({
      where: { id: numericId },
      relations: ['owner', 'offers']
    });

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(ERR_MESSAGE.UNAUTHORIZED_ACTION);
    }

    return wish;
  }

  async findWishesByOwnerId(ownerId: number) {
    return await this.wishRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner']
    })
  }

  async findWishesByUsername(username: string) {
    return await this.wishRepository.find({
      where: { owner: { username: username } },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        link: true,
        image: true,
        price: true,
        raised: true,
        copied: true,
        description: true,
        offers: true,
      },
      relations: ['offers'] // какие связанные поля прислать в ответе
    })
  }

  async findOne(id: string, userId: number) {
    return await this.findOwnerWishById(id, userId);
  }

  async update(id: string, dto: UpdateWishDto, userId: number) {
    const wish = await this.findOwnerWishById(id, userId);

    // нельзя изменять стоимость, если уже есть желающие скинуться
    const raisedIsNotNull = wish.raised !== 0;
    const priceIsNotEmpty = dto.price !== undefined;
    if (raisedIsNotNull && priceIsNotEmpty) {
      throw new BadRequestException(ERR_MESSAGE.FORBIDDEN_PRICE_CHANGE);
    }

    this.wishRepository.save({
      ...wish,
      ...dto
    });
    return "Желание успешно изменено!";
  }

  async remove(id: string, userId: number) {
    const wish = await this.findOwnerWishById(id, userId);

    return await this.wishRepository.remove(wish);
  }

  async copy(id: string, userId: number) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(ERR_MESSAGE.INVALID_DATA);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // начинаем транзакцию
    try {
      const wish = await this.wishRepository.findOneOrFail({
        where: { id: numericId },
      });

      const dto = {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
      };

      // массив промисов для транзакции
      const operations = [
        this.create(dto, userId),
        this.wishRepository.save({
          ...wish,
          copied: wish.copied + 1,
        })
      ];

      await Promise.all(operations);

      // если все операции успешны, коммитим транзакцию
      await queryRunner.commitTransaction();
      return 'Удалось создать копию';

    } catch (err) {
      this.logger.log(err);
      this.logger.log(err.message);

      await queryRunner.rollbackTransaction();

      return 'НЕ удалось создать копию';
    } finally {
      await queryRunner.release(); // завершаем транзакцию
    }
  }
}
