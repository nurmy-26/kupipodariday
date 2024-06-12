import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from 'src/utils/helpers/hash';
import { UserResponseDto } from './dto/user-response.dto';
import checkUnique from 'src/utils/helpers/check-unique';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // инжектируем стандартный реп-й TypeORM для сущности User
    private readonly usersRepository: Repository<User>, // для возможности работать с БД ч-з стандартные методы р-я
  ) { }

  // регистрация (create нового пол-ля)
  async signup(dto: CreateUserDto): Promise<User> {
    const { username, email, password } = dto;
    await checkUnique(this.usersRepository, [
      { email: email },
      { username: username }
    ], 'Пользователь с таким email или именем уже существует');  

    const user = this.usersRepository.create({ // создаем в БД
      ...dto,
      about: dto.about || 'Пока ничего не рассказал о себе', // фронтенд посылает пустую строку, мешающую дефолтному значению
      password: await hashValue(password), // вместо ориг пароля записываем hash (перезапись)
    });

    return this.usersRepository.save(user);
  }

  // метод для исп-я в других сервисах (вернет полностью запись из БД, в т.ч. пароль)
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  // используем в findSelf
  findOne(query: FindOneOptions<User>) {
    console.log(query)
    const data = this.usersRepository.findOneOrFail(query);
    if (!data) {
      throw new Error('No data was found')
    }
    // return this.usersRepository.findOneOrFail(query);
    return data;
  }

  async findCurrentUser(userId: number): Promise<User> {
    const query = {
      where: { id: userId },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    };

    return await this.findOne(query);
  }

  // обновить пользователя
  async update(id: number, dto: UpdateUserDto) {
    const { username, email, password } = dto;
    // чтобы не смог заменить имя и email на уже существующие в базе
    await checkUnique(this.usersRepository, [
      { email: email },
      { username: username }
    ], 'Пользователь с таким email или именем уже существует', id);

    const user = await this.findById(id);
    if (password) {
      dto.password = await hashValue(password); // если обновляли пароль - хешируем его
    }

    return this.usersRepository.save({
      ...user,
      ...dto
    });
  }
}
