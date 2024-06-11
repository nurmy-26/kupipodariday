import { ApiProperty } from '@nestjs/swagger';
import { UserPublicResponseDto } from './user-public-profile-response.dto';

export class UserResponseDto extends UserPublicResponseDto {
  @ApiProperty({ example: 'user@mail.ru' })
  email: string;
}
