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
import {
  Body,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common/decorators';
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
import { AwsService } from './../services/aws.service';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly CatsService: CatsService,
    private readonly AuthService: AuthService,
    private readonly awsService: AwsService,
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

  // 고양이 이미지 업로드 API - AWS S3에 저장
  @ApiOperation({ summary: '고양이 이미지 업로드' })
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.awsService.uploadFileToS3('cats', file);
  }
  //
  // 고양이 이미지 업로드 API - 로컬에 저장
  // uploadCatImg(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @CurrentUser() cat: Cat,
  // ) {
  //   console.log(files);
  // return this.CatsService.uploadImg(cat, files);
  // }
  //
  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.CatsService.getAllCat();
  }
}
