import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // NestExpressApplication을 통해 app이 익스프레스 앱이라고 명시적으로 표현
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // class validator 사용을 위함
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  ); // swagger 접속 시 ID/PW 요구

  // 미디어 파일의 경로를 반환하는 부분
  // app이 익스프레스 앱이 아닐 경우 Static 파일을 사용할 수 없다.
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/media',
  });
  // 'http://localhost:8000/media/cats/file.png'와 같은 양식으로 나오게된다.

  const config = new DocumentBuilder()
    .setTitle('Swagger Test')
    .setDescription('Hello!')
    .setVersion('1.0.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
