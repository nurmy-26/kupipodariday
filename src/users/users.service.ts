import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { hashValue } from 'src/utils/helpers/hash';
import checkUnique from 'src/utils/helpers/check-unique';
import { ERR_MESSAGE } from 'src/utils/constants/error-messages';
import { FindUserDto } from './dto/find-user.dto';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // инжектируем стандартный реп-й TypeORM для сущности User
    private readonly usersRepository: Repository<User>, // для возможности работать с БД ч-з стандартные методы р-я
  ) {}

  // регистрация (create нового пол-ля)
  async signup(dto: CreateUserDto): Promise<User> {
    const { username, email, password } = dto;
    await checkUnique(
      this.usersRepository,
      [{ email: email }, { username: username }],
      ERR_MESSAGE.PROFILE_NAME_CONFLICT,
    );

    const user = await this.usersRepository.create({
      // создаем в БД
      ...dto,
      about: dto.about || 'Пока ничего не рассказал о себе', // фронтенд посылает пустую строку, мешающую дефолтному значению
      password: await hashValue(password), // вместо ориг пароля записываем hash (перезапись)
    });

    return await this.usersRepository.save(user);
  }

  // метод для исп-я в других сервисах (вернет полностью запись из БД, в т.ч. пароль)
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id });
    return user;
  }

  async findOne(query: FindOneOptions<User>) {
    const data = await this.usersRepository.findOneOrFail(query);
    if (!data) {
      throw new NotFoundException(ERR_MESSAGE.RESOURCE_NOT_FOUND);
    }
    return data;
  }

  async findMany(query: FindOneOptions<User>): Promise<User[]> {
    const data = await this.usersRepository.find(query);
    if (!data.length) {
      throw new NotFoundException(ERR_MESSAGE.RESOURCE_NOT_FOUND);
    }
    return data;
  }

  async findUserById(userId: number): Promise<User> {
    const query = {
      where: { id: userId },
    };

    return await this.findOne(query);
  }

  async findByUsername(username: string): Promise<User> {
    const query = {
      where: { username: username },
    };

    return await this.findOne(query);
  }

  async findByUsernameOrEmail(payload: FindUserDto): Promise<User[] | null> {
    const query = {
      // массив where означает "ИЛИ" (сработает при одном из условий)
      where: [
        // Like - для поиска по подстроке
        { username: Like(`%${payload.query}%`) },
        { email: Like(`%${payload.query}%`) },
        // { username: payload.query },
        // { email: payload.query }
      ],
    };

    return await this.findMany(query);
  }

  // обновить пользователя
  async update(id: number, dto: UpdateUserDto) {
    const { username, email, password } = dto;
    // чтобы не смог заменить имя и email на уже существующие в базе
    await checkUnique(
      this.usersRepository,
      [{ email: email }, { username: username }],
      ERR_MESSAGE.PROFILE_NAME_CONFLICT,
      id,
    );

    const user = await this.findById(id); // получаем исходную инфо, чтобы не потерять при обновлении
    if (password) {
      dto.password = await hashValue(password); // если обновляли пароль - хешируем его
    }

    return this.usersRepository.save({
      ...user,
      ...dto,
    });
  }

  // добавление нового вишлиста в поле wishlists
  async updateWishlists(wishlist: Wishlist, userId) {
    const user = await this.findUserById(userId);

    return await this.usersRepository.save({
      ...user,
      wishlists: [...user.wishlists, wishlist],
    });
  }
}
