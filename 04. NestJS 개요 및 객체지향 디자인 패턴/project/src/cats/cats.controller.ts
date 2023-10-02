import { CatsService } from './cats.service';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { HttpException, UseFilters, Param, ParseIntPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exceptions/http-exception.filter';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import { Body } from '@nestjs/common/decorators';
import { CatRequestDto } from './dto/cats.request.dto';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly CatsService: CatsService) {}

  @Get()
  // 현재 로그인한 고양이
  getCurrentCat() {
    return 'current cat';
  }

  // 고양이 회원가입
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.CatsService.signUp(body);
  }

  // 고양이 로그인
  @Post('login')
  logIn() {
    return 'login';
  }

  // 고양이 로그아웃
  @Post('logout')
  logOut() {
    return 'logout';
  }

  // 고양이가 자신의 이미지를 업로드
  @Post('upload/cats')
  uploadCatImg() {
    return 'uploadImg';
  }
}
