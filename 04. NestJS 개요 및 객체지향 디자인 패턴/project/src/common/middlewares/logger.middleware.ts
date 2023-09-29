import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // 콘솔 로그를 사용하는 방법
    // console.log(req.ip);
    // console.log(req.originalUrl);

    // nestjs에서 제공하는 로거를 사용하는 방법
    res.on('finish', () => {
      this.logger.log(
        `${req.ip} ${req.method} ${res.statusCode}`,
        req.originalUrl,
      );
    });
    next();
  }
}
