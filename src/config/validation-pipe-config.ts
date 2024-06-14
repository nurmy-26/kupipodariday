import { ValidationPipe } from '@nestjs/common';

export const validationPipe = new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: true, // вызовет ошибку при наличии полей, не указанных в DTO
});
