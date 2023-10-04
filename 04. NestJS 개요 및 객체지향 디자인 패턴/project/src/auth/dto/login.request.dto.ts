import { Cat } from 'src/cats/cats.schema';
import { PickType } from '@nestjs/swagger';

export class LoginRequestDto extends PickType(Cat, [
  'email',
  'password',
  // 로그인을 위한 용도이니 Cat 스키마 모델에서 email과 password만 가져온다
] as const) {}
