import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    // 아래 옵션은 mongoose 버전 6.0이 되면서 기본적으로 지원하기 때문에
    // 별도로 추가해줄 필요가 없어졌다.
    //   {
    //   useNewUrlParser: true, // 기본 지원, 옵션 등록 시 에러 발생
    //   useUnifiedTopology: true, // 최신 mongodb 드라이버 엔진을 사용, 기본 지원, 생략 가능
    //   useCreateIndex: true, // 더 이상 지원하지 않는 옵션
    //   useFindAndModify: false, // 더 이상 지원하지 않는 옵션
    // }
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
