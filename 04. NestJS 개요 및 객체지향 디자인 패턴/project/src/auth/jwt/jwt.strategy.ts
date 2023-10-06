import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Payload } from './jwt.payload';
import { CatsRepository } from './../../cats/cats.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly CatsRepository: CatsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 헤더의 토큰을 Bearer 토큰으로 추출한다.
      secretOrKey: process.env.JWT_SECRET,
      // 시크릿키는 이 jwt 전략을 사용하는 auth.module.ts의 것과 동일해야 한다.
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const cat = await this.CatsRepository.findCatByIdWithoutPassword(
      payload.sub,
    );

    if (cat) {
      return cat; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
