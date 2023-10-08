import { Module, forwardRef } from '@nestjs/common';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './cats.schema';
import { CatsRepository } from './cats.repository';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload', // dest는 'destination'의 약자로 뒤에 오는 경로에 저장된다는 의미이다.
    }),

    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    forwardRef(() => AuthModule),
    // AuthModule이 export하고 있는 AuthService를 사용할 수 있다
    // forwardRef 순환 종속성 해결
    // CatsModule은 AuthModule을 종속받고 있고,
    // AuthModule은 CatsModule을 종속받고 있다.
    // 이러한 상황을 순환 종속성이라고 하며 이를 해결하기 위해 forwardRef함수를 사용한다.
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
  // 다른 모듈에서 CatsService, CatsRepository를 사용할 수 있다
})
export class CatsModule {}
