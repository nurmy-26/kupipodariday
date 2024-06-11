import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

export type WishPaginator = {
  data: Wish[];
  page: number;
  siz: number;
  totalCount: number;
  totalPage: number;
}

@Injectable()
export class WishesService {
  constructor(
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

  async findWishById(ownerId: number) {
    return await this.wishRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner']
    })
  }
}
