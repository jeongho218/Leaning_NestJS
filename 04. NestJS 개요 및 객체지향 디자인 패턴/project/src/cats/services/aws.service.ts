import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class AwsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    // ConfigService 자체를 의존성 주입을 받아옴으로써
    // process.env.~~ 와 같이 불러오던 .env 환경변수의 내용을
    // '~~'의 방식으로 사용할 수 있게된다.
    this.awsS3 = new AWS.S3({
      // AWS 모듈의 S3클래스를 사용
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
      // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      // process.env.AWS_S3_SECRET_KEY
      region: this.configService.get('AWS_S3_REGION'),
      // process.env.AWS_S3_REGION
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
    // process.env.AWS_S3_BUCKET_NAME
  }

  // 데이터를 AWS S3에 저장(업로드)하는 API
  async uploadFileToS3(
    folder: string, // 데이터를 저장할 경로
    file: Express.Multer.File, // controller에서 전달받은 데이터
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectAclOutput, AWS.AWSError>;
    contentType: string; // 이미지인지 비디오인지
  }> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
      return { key, s3Object, contentType: file.mimetype };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  // 데이터를 S3에서 삭제하는 API
  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  // 데이터의 URL 경로를 반환하는 API
  //   public getAwsS3FileUrl(objectKey: string) {
  //     const s3Url = `aws s3에 저장된 데이터 url https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  //     console.log(s3Url);
  //     return s3Url;
  //   }
  // 파일이 어디 저장되어 있는지(objectKey) 정보를 전달하면
  // 그에 관한 URL 소스를 제공한다
}
