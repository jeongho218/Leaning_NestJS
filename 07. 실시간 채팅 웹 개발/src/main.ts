import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  // public 하단에 있는 내용을
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // views에서 렌더링하여 클라이언트에게 전달한다.
  app.setViewEngine('hbs');
  // view 엔진은 hbs
  app.useGlobalPipes(new ValidationPipe());
  // class-validator 전역 사용
  await app.listen(8000);
}
bootstrap();
