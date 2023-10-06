import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from './../cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly CatsRepository: CatsRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email: email, password: password } = data;

    // 해당하는 email이 있는가?
    const cat = await this.CatsRepository.findCatByEmail(email);

    // 없다면
    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // 패스워드가 일치하는가?
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
      // bcrypt.compare 단어 그대로 비교한다
      // compare 메소드는 promise를 리턴하기 때문에 await을 붙여주어야 한다.
      // 사용자가 입력한 password와, DB를 조회한 결과인 cat의 password를
    );

    // 패스워드가 일치하지 않다면
    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: email, sub: cat.id };
    // sub는 토큰 제목을 의미하며 cat의 id, mongodb가 생성하는 고유 식별자를 넣는다.

    return {
      token: this.jwtService.sign(payload),
      // payload의 정보를 jwt.sign() 함수를 통해서 토큰을 생성한다.
    };
  }
}
