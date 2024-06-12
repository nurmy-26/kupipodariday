import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

// проверяем, не содержится ли уже в БД записей с введенными полями (проверка полей на уникальность)
async function checkUnique<T>(repository: Repository<T>, criteria: Array<Partial<T>>, errorMessage: string, excludeId?: number): Promise<void> {
  const queryBuilder = repository.createQueryBuilder('entity');

  criteria.forEach((criterion, index) => {
    const [field] = Object.keys(criterion);
    const [value] = Object.values(criterion);

    queryBuilder.orWhere(`entity.${field} = :value${index}`, { [`value${index}`]: value });
  });

  // если нужно исключить запись из проверки
  // например, чтобы текущий пользователь при обновлении профиля не вызвал ошибку из-за совпадение его имени и почты с записанными в базе
  if (excludeId) {
    queryBuilder.andWhere('entity.id != :excludeId', { excludeId });
  }

  const existingRecord = await queryBuilder.getOne();

  if (existingRecord) {
    throw new BadRequestException(errorMessage);
  }
}

export default checkUnique;

// вариант для проверки на уникальность 1 поля
// async function checkUnique<T>(repository: Repository<T>, criteria: FindOptionsWhere<T>, errorMessage: string): Promise<void> {
//   const existingRecord = await repository.findOne({ where: criteria });

// if (existingRecord) {
//     throw new Error(errorMessage);
//   }
// }