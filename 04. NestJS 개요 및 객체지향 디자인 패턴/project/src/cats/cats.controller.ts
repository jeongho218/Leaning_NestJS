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
import { ReadOnlyCatDto } from './dto/cat.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './../auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly CatsService: CatsService,
    private readonly AuthService: AuthService,
  ) {}

  // 현재 로그인한 고양이
  @ApiOperation({ summary: '현재 로그인한 고양이 가져오기' })
  @Get()
  getCurrentCat() {
    return 'current cat';
  }

  // 고양이 회원가입
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.CatsService.signUp(body);
  }

  // 고양이 로그인
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    // return 'login';
    return this.AuthService.jwtLogin(data);
  }

  // 고양이 로그아웃
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut() {
    return 'logout';
  }

  // 고양이가 자신의 이미지를 업로드
  @ApiOperation({ summary: '고양이 이미지 업로드' })
  @Post('upload/cats')
  uploadCatImg() {
    return 'uploadImg';
  }
}
