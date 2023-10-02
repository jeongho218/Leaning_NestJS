import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SchemaOptions, Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true, // DB에 데이터가 만들어질때 타임스탬프를 찍는다
};

@Schema(options)
export class Cat extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  imgUrl: string;

  readonly readOnlyData: { id: string; email: string; name: string };
}

export const CatSchema = SchemaFactory.createForClass(Cat);

// "data": {
//     "email": "fourthTest@email.com",
//     "name": "fourth",
//     "password": "$2b$10$0fWqIwT6Yazo54tPR0zxP.3BQV7oN1lx2YaoJKVd//lwngWMwVJcS",
//     "_id": "651abd06a76166673177cdfb",
//     "createdAt": "2023-10-02T12:52:22.805Z",
//     "updatedAt": "2023-10-02T12:52:22.805Z",
//     "__v": 0
// }

// postman 등에서 회원가입 API를 사용하였을때
// 암호화된 패스워드가 노출되는 것을 막는 방법
// mongoose에서 지원해주는 virtual field를 사용한다.
// virtual field는 실제로 DB에 저장되는 field는 아니지만
// 개발자가 비즈니스 로직에서 사용할 수 있는 field이다.

// 스키마에 virtual 메소드를 사용한다
// readOnlyData: 클라이언트에게 보여줄 데이터만 가상으로 필터링해서 나간다
CatSchema.virtual('readOnlyData').get(function (this: Cat) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
  };
});
// 실제 실행 결과, 패스워드는 감춰졌다
// "data": {
//     "id": "651abc2f56d0a1464e2bc48a",
//     "email": "thirdTest@email.com",
//     "name": "green"
// }
