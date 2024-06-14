import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Length(1, 64)
  @IsNotEmpty()
  @ApiProperty({ example: 'Илон Маск', description: 'Имя пользователя' })
  username: string;

  @Length(0, 200)
  @IsOptional()
  @ApiProperty({
    example: 'Миллиардер, филантроп, гений',
    description: 'Описание пользователя',
  })
  about?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    example: 'https://i.pravatar.cc/300',
    description: 'Аватар пользователя',
  })
  avatar?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'elon1234@mail.ru',
    description: 'Почта пользователя',
  })
  email: string;

  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({ example: '1234', description: 'Пароль пользователя' })
  password: string;
}
