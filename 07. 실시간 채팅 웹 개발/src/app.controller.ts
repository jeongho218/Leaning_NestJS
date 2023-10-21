import { Controller, Get, Render } from '@nestjs/common';
// import { AppService } from './app.service';
// controller를 통해서 views를 렌더링할 것이기 때문에
// 서비스가 필요없다.

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return {
      data: {
        title: 'Chattings',
        copyright: 'ctrs',
      },
    };
  }
  // root. 가장 처음에 들어오는 뷰를 렌더링한다.
}
