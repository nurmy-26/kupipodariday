import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ENV_EXAMPLE } from './config/env-example';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntityNotFoundErrorFilter } from './utils/filters/entity-not-found-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function start() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT') || ENV_EXAMPLE.PORT;

  app.enableCors(); // без этой строки нельзя делать запросы к этому API с другого сервера
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('КупиПодариДай')
    .setDescription('Документация API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // без этого не сработает валидация
      transform: true,
      forbidNonWhitelisted: true, // вызовет ошибку при наличии полей, не указанных в DTO
    }),
  );

  // глобальные фильтры исключений
  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  await app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту: 💻 ${PORT}`);
    console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
  });
}
start();
