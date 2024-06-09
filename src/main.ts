import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ENV_EXAMPLE } from './config/env-example';

async function start() {
  const PORT = process.env.PORT || ENV_EXAMPLE.PORT;

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту: 💻 ${PORT}`);
    console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
  });
}
start();
