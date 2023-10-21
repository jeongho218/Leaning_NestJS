import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// controller를 통해서 views를 렌더링할 것이기 때문에
// 서비스는 사용하지 않는다.
