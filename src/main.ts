import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV_EXAMPLE } from './config/env-example';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { EntityNotFoundErrorFilter } from './utils/filters/entity-not-found-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { swaggerConfig } from './config/swagger-config';
import { validationPipe } from './config/validation-pipe-config';
import helmet from 'helmet';
import limiter from './config/limiter';

async function start() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT') || ENV_EXAMPLE.PORT;

  app.use(helmet());
  app.use(limiter);

  app.enableCors(); // без этой строки нельзя делать запросы к этому API с другого сервера
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(validationPipe); // без этого не сработает валидация
  app.useGlobalFilters(new EntityNotFoundErrorFilter()); // глобальные фильтры исключений

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту: 💻 ${PORT}`);
    console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
  });
}
start();
