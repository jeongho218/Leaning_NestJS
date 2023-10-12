import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat } from './cats.schema';
import { CatRequestDto } from './dto/cats.request.dto';
import { CommentSchema } from 'src/comments/comments.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async findAll() {
    const CommentsModel = mongoose.model('comments', CommentSchema);

    const result = await this.catModel
      .find()
      .populate('comments', CommentsModel);
    // populate() 메소드. 다른 도큐먼트와 이어주는 역할을 한다

    return result;

    // return await this.catModel.find();
  }

  async findCatByIdWithoutPassword(
    catId: string | Types.ObjectId,
  ): Promise<Cat | null> {
    const cat = await this.catModel.findById(catId).select('-password');
    // select(): 매개변수 catId로 조회한 고양이 데이터 중에서 사용할 데이터를 골라낸다.
    // '-password': catId로 조회한 고양이 데이터 중 'password'를 제외한 내용을 변수 cat에 할당한다.
    // 보안상 이유로 request.user에 저장할때는 password 필드를 제외하는 것이 좋기 때문이다.
    // 만약 'email'과 'name'만 가져오고 싶다면 .select('email name')이라고 입력한다.
    return cat;
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  async existByEmail(email: string): Promise<boolean> {
    const result = await this.catModel.exists({ email: email });
    if (result) return true;
    // try {
    //   const result = await this.catModel.exists({ email: email });
    //   if (result) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } catch (error) {
    //   throw new HttpException('db error', 400);
    // }
  }

  // 고양이의 이미지를 업데이트
  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);
    cat.imgUrl = `http://localhost:8000/media/${fileName}`;
    const newCat = await cat.save(); // save() 메소드, 저장
    console.log(newCat);
    return newCat.readOnlyData;
  }

  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }
}
