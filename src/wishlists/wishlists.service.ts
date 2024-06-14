import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { ERR_MESSAGE } from 'src/utils/constants/error-messages';

@Injectable()
export class WishlistsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, dto: CreateWishlistDto) {
    const user = await this.usersService.findById(userId);
    const wishes = await this.wishesService.findAllByIds(dto.itemsId);

    return await this.wishlistsRepository.save({
      name: dto.name,
      image: dto.image,
      owner: user,
      items: wishes,
    });

    // const wishlist = await this.wishlistsRepository.save({
    //   name: dto.name,
    //   image: dto.image,
    //   owner: user,
    //   items: wishes,
    // });
    // await this.usersService.updateWishlists(wishlist, userId);

    // return wishlist;
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findById(id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(ERR_MESSAGE.INVALID_DATA);
    }

    return await this.wishlistsRepository.findOneOrFail({
      where: { id: numericId },
      relations: ['owner', 'items'],
    });
  }

  // метод для исп-я в других методах (поиск по СВОИМ вишлистам)
  async findOwnerWishlistById(id: string, userId: number) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(ERR_MESSAGE.INVALID_DATA);
    }

    const wishlist = await this.wishlistsRepository.findOneOrFail({
      where: { id: numericId },
      relations: ['owner', 'items'],
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(ERR_MESSAGE.UNAUTHORIZED_ACTION);
    }

    return wishlist;
  }

  async update(id: string, dto: UpdateWishlistDto, userId: number) {
    const wish = await this.findOwnerWishlistById(id, userId);

    return await this.wishlistsRepository.save({
      ...wish,
      ...dto,
    });
  }

  async remove(id: string, userId: number) {
    const wish = await this.findOwnerWishlistById(id, userId);

    return await this.wishlistsRepository.remove(wish);
  }
}
