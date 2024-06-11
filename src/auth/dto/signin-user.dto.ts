import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";

// чтобы не дублировать DTO, создаем новый класс на основе старого, выбрав поля username и password
export class SigninUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
] as const) {}
