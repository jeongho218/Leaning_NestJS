import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 헤더의 토큰을 Bearer 토큰으로 추출한다.
      secretOrKey: 'secretKey',
      // 시크릿키는 이 jwt 전략을 사용하는 auth.module.ts의 것과 동일해야 한다.
      ignoreExpiration: false,
    });
  }

  //   async validate(payload) {}
}
