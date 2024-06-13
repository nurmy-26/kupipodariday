import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ERR_MESSAGE } from 'src/utils/constants/error-messages';
import { DESC, LAST_WISHES, TOP_WISHES } from 'src/utils/constants/data-base';

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
  ) { }

  async create(createWishDto: CreateWishDto, userId: number) {
    // перед тем как создавать - находим пользователя
    const owner = await this.usersService.findById(userId);
    const wish = this.wishRepository.create({ ...createWishDto, owner });

    return this.wishRepository.save(wish);
  }

  async findAll(query: {
    page: number; limit: number
  }): Promise<WishPaginator> {
    const skip = (query.page - 1) * query.limit;
    console.log(skip)
    const [data, totalCount] = await this.wishRepository.findAndCount({ take: query.limit, skip });
    const totalPage = Math.ceil(totalCount / query.limit);

    return {
      data,
      page: query.page,
      siz: query.limit,
      totalCount,
      totalPage
    }
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

  // метод для исп-я в других методах
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
    return await this.findOwnerWishById(
      id,
      userId
    )
  }

  async update(id: string, dto: UpdateWishDto, userId: number) {
    const wish = await this.findOwnerWishById(
      id,
      userId
    )

    this.wishRepository.save({
      ...wish,
      ...dto
    });
    // return "Желание успешно изменено!";
  }

  async remove(id: string, userId: number) {
    const wish = await this.findOwnerWishById(
      id,
      userId
    );

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

      // массив промисов для параллельного выполнения
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
