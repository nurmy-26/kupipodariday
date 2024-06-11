import { PartialType } from '@nestjs/swagger'; // важно импортировать отсюда чтоб отобразить в док-и swagger
import { CreateUserDto } from './create-user.dto';

// делаем все поля CreateUserDto не обязательными для заполнения (так как обновлять можно частично)
export class UpdateUserDto extends PartialType(CreateUserDto) {}
