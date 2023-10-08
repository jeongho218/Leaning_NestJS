import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {
  try {
    console.log('💾 Create a root uploads folder...');
    fs.mkdirSync(path.join(__dirname, '..', `uploads`));
    // fs.mkdir 폴더를 생성한다.
    // 현재 폴더의 부모 폴더로 올라가 'uploads' 폴더를 생성한다.
  } catch (error) {
    console.log('The folder already exists...');
    // 이미 'uploads' 폴더가 존재하는 경우
  }

  try {
    console.log(`💾 Create a ${folder} uploads folder...`);
    fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`));
    // 상단에서 생성했던 'uploads'폴더에 하위 폴더를 만든다.
    // 폴더명은 매개변수 folder를 따른다.
  } catch (error) {
    console.log(`The ${folder} folder already exists...`);
    // 이미 해당 폴더가 존재하는 경우
  }
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder);
  // 함수 createFolder의 내용을 따라 폴더를 생성한다.
  // 폴더명은 매개변수 folder가 된다.
  return multer.diskStorage({
    destination(req, file, cb) {
      // destination. 어디에 저장할 지
      const folderName = path.join(__dirname, '..', `uploads/${folder}`);
      cb(null, folderName);
      // 함수 destination의 옵션 cb는 callback의 약자
      // 첫번재 옵션은 error, 두번째 옵션이 destination(목적지)에 대한 내용
    },

    filename(req, file, cb) {
      // filename. 어떤 이름으로 올릴 지
      const ext = path.extname(file.originalname);
      // extname()메소드 업로드한 파일을 읽어서 확장자를 추출한다.
      // 예를들어 index.html을 업로드하면 .html을 반환한다.
      // .originalname:
      // (property) Express.Multer.File.originalname: string
      // Name of the file on the uploader's computer.
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;
      // 업로드 파일의 원본 이름과 학장자명을 붙여 변수 fileName에 할당한다.
      // 기존 파일가 겹치면 에러가 발생할 수 있으니 업로드 당시의 시간도 함께 붙인다.

      cb(null, fileName);
      // 함수 destination의 옵션 cb는 callback의 약자
      // 첫번재 옵션은 error, 두번째 옵션이 파일의 이름에 대한 내용
    },
  });
};

export const multerOptions = (folder: string) => {
  // upload폴더에 하위 폴더를 만들어 준다.
  const result: MulterOptions = {
    storage: storage(folder),
  };
  // MulterOptions의 타입 storage
  // 상단에 위치한 함수 storage의 결과를 할당한다
  return result;
};
