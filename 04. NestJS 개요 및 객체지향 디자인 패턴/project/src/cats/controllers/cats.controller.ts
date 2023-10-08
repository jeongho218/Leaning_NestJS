import { CatsService } from '../services/cats.service';
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
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import { SuccessInterceptor } from '../../common/interceptors/success.interceptor';
import { Body, Req, UploadedFiles, UseGuards } from '@nestjs/common/decorators';
import { CatRequestDto } from '../dto/cats.request.dto';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multer.options';
import { Cat } from '../cats.schema';

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
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    return cat.readOnlyData;
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
    return this.AuthService.jwtLogin(data);
  }

  // 고양이 이미지 업로드
  @ApiOperation({ summary: '고양이 이미지 업로드' })
  // @UseInterceptors(FileInterceptor('image')) // FileInterceptor, 단일 파일
  @UseGuards(JwtAuthGuard)
  // 현재 로그인한 고양이의 이미지를 가져오려면, 자신을 인증해야하므로 사용
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  // FilesInterceptor, 복수 파일
  // 'image'는 업로드한 내용, 10은 한번에 올릴 수 있는 파일의 개수 제한
  // 사전에 작성한 multerOptions, /upload/cats에 파일을 저장하겠다는 의미
  @Post('upload')
  uploadCatImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() cat: Cat,
  ) {
    console.log(files);
    return this.CatsService.uploadImg(cat, files);
  }
}
