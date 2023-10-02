import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // class validator 사용을 위함
  app.useGlobalFilters(new HttpExceptionFilter());
  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
