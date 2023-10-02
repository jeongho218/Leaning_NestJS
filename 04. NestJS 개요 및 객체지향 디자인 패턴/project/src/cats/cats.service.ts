import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from './cats.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catModel.exists({ email });

    // 이미 존재하는 이메일일 경우 에러처리
    if (isCatExist) {
      throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
      // 위 방법과 아래 방법은 동일한 기능을 한다.
      //   throw new HttpException('해당하는 고양이는 이미 존재합니다.', 403);
    }

    // 패스워드 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB에 저장
    const cat = await this.catModel.create({
      email: email,
      name: name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }
}
