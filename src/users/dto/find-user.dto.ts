import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FindUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@mail.ru', description: 'Почта или имя пользователя' })
  query: string;
}
