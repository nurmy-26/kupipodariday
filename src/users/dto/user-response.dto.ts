import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Илон Маск' })
  username: string;

  @ApiProperty({ example: 'Пока ничего не рассказал о себе' })
  about: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  avatar: string;

  @ApiProperty({ example: 'user@mail.ru' })
  email: string;

  @ApiProperty({ example: '2024-06-11T22:08:22.579Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-06-13T23:59:22.579Z' })
  updatedAt: Date;
}
