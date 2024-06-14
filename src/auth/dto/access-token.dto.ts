import { ApiProperty } from '@nestjs/swagger';

export class SigninUserResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT-токен',
  })
  access_token: string;
}
