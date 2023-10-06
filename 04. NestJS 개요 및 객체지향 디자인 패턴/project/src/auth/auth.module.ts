import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CatsModule } from 'src/cats/cats.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    // jwt strategy에 대한 설정이 들어가는 곳
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // 시크릿키는 jwt 전략을 가져오는 ./jwt/jwt.strategy.ts의 것과 동일해야 한다.
      signOptions: { expiresIn: '1y' },
    }), // 사용자가 로그인할때마다 사용하는 부분

    forwardRef(() => CatsModule),
    // CatsModule이 export하고 있는 CatsService, CatsRepository를 사용할 수 있다
    // forwardRef 순환 종속성 해결
    // AuthModule은 CatsModule을 종속받고 있고,
    // CatsModule은 AuthModule을 종속받고 있다.
    // 이러한 상황을 순환 종속성이라고 하며 이를 해결하기 위해 forwardRef함수를 사용한다.
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
