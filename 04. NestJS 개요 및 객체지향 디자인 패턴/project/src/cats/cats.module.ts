import { Module, forwardRef } from '@nestjs/common';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './cats.schema';
import { CatsRepository } from './cats.repository';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { CommentSchema, Comments } from '../comments/comments.schema';
import { AwsService } from './services/aws.service';
import { ConfigModule } from '@nestjs/config';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload', // dest는 'destination'의 약자
      storage: memoryStorage(),
    }),

    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentSchema },
      { name: Cat.name, schema: CatSchema },
    ]),
    forwardRef(() => AuthModule),
    // AuthModule이 export하고 있는 AuthService를 사용할 수 있다
    // forwardRef 순환 종속성 해결
    // CatsModule은 AuthModule을 종속받고 있고,
    // AuthModule은 CatsModule을 종속받고 있다.
    // 이러한 상황을 순환 종속성이라고 하며 이를 해결하기 위해 forwardRef함수를 사용한다.

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ConfigModule을 의존성 주입 받음으로써
    // controller, service, repository 등에서
    // process.env.~~ 와 같이 불러오던 .env 환경변수의 내용을
    // '~~'의 방식으로 사용할 수 있게된다.
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository, AwsService],
  exports: [CatsService, CatsRepository],
  // 다른 모듈에서 CatsService, CatsRepository를 사용할 수 있다
})
export class CatsModule {}
