import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('КупиПодариДай')
  .setDescription('Документация API')
  .setVersion('1.0.0')
  .build();
