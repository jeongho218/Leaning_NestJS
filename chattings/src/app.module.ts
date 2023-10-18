import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
// import { AppService } from './app.service';

import { ChatsModule } from './chats/chats.module';
// controller를 통해서 views를 렌더링할 것이기 때문에
// 서비스가 필요없다.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // app.module에서 ConfigModule이 global하다라고 선언함으로써
    // 다른 모듈에서 ConfigModule을  선언할 필요가 없어진다.
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [],
  // providers: [AppService],
  // controller를 통해서 views를 렌더링할 것이기 때문에
  // 서비스가 필요없다.
})
export class AppModule implements NestModule {
  configure() {
    const DEBUG = process.env.MODE === 'dev' ? true : false;
    mongoose.set('debug', DEBUG);
  } // mongodb 연결 확인
}

// git 재설정
