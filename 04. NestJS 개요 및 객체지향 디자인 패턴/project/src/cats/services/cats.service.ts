import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatRequestDto } from '../dto/cats.request.dto';
import { Cat } from '../cats.schema';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from '../cats.repository';

@Injectable()
export class CatsService {
  // constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}
  constructor(private readonly CatsRepository: CatsRepository) {}

  // 모든 고양이 가져오기 API
  async getAllCat() {
    const allCat = await this.CatsRepository.findAll();
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
    return readOnlyCats;
  }
  // DB에서 모든 고양이들의 데이터를 가져오면서,
  // map을 통해 schema/readOnlyData에서 허가된 데이터만을 가져오도록 한다.

  // 고양이의 이미지 업로드 API
  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;
    console.log(fileName);

    const newCat = await this.CatsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log(newCat);
    return newCat;
  }

  // 회원가입 API
  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.CatsRepository.existByEmail(email);

    // 이미 존재하는 이메일일 경우 에러처리
    if (isCatExist) {
      throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
      // 위 방법과 아래 방법은 동일한 기능을 한다.
      //   throw new HttpException('해당하는 고양이는 이미 존재합니다.', 403);
    }

    // 패스워드 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB에 저장
    const cat = await this.CatsRepository.create({
      email: email,
      name: name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }
}
