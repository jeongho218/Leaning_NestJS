import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// AuthGuard는 strategy.ts 파일을 자동으로 실행시켜주는 기능이다.
// 이 strategy.ts는 직접 생성해주어야 한다.
