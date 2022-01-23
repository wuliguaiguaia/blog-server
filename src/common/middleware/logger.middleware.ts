import { NextFunction, Request, Response } from 'express';
import * as cls from 'cls-hooked';
import * as config from 'config';
import { WinstonLogger } from 'nest-winston';
import winston from 'winston';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = Logger;
  use(req: Request, res: Response, next: NextFunction) {
    const oldEnd = res.end;

    // 已经使用 响应拦截器
    // res.end = function (chunk) {
    //   // eslint-disable-next-line prefer-rest-params
    //   // oldEnd.apply(res, arguments);
    //   // console.log(res);
    // };
    next();
  }

  getLogId() {
    // const namespace = cls.getNamespace('lemon');
    // const context = namespace.get('currReq');
    // console.log(context);
  }
}
