import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from 'src/utils/helpers/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // инжектируем стандартный реп-й TypeORM для сущности User
    private readonly usersRepository: Repository<User>, // для возможности работать с БД ч-з стандартные методы р-я
  ) { }

  // регистрация (create нового пол-ля)
  async signup(dto: CreateUserDto): Promise<User> {
    const { password } = dto;
    const user = await this.usersRepository.create({ // создаем в БД
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
    return this.usersRepository.findOneOrFail(query);
  }

  // обновить пользователя
  async update(id: number, dto: UpdateUserDto) {
    const { password } = dto;
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
