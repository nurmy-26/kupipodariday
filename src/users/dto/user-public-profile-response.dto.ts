import { OmitType } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

// исключаем поле email
export class UserPublicResponseDto extends OmitType(UserResponseDto, [
  'email',
] as const) {}
