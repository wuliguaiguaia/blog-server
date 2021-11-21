import { Request } from 'express';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import {
  LoggerService,
  Injectable,
  Inject,
  HttpException,
} from '@nestjs/common';
import { Logger } from 'winston';
import * as cls from 'cls-hooked';

@Injectable()
export class MyLogger implements LoggerService {
  constructor(
    /**
     * WINSTON_MODULE_NEST_PROVIDER vs  WINSTON_MODULE_PROVIDER ？
     * https://www.npmjs.com/package/nest-winston
     * > WINSTON_MODULE_PROVIDER 配合 Logger from winston
     * > WINSTON_MODULE_NEST_PROVIDER 配合 LoggerService from @nestjs/common
     */

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  getContext() {
    const namespace = cls.getNamespace('lemon');
    const currReq: Request = namespace.get('currReq');
    const logId: number = namespace.get('logid');
    if (!currReq) {
      throw new HttpException('获取上下文失败', 200);
    }
    /**
     * express 中
     * > req.url -> "/id"
     * > req.originalUrl -> "/user/id"
     * > req.baseUrl -> "/user"
     *
     * nest 中没差
     */

    const { url, method, body, query, params } = currReq;

    return { logId, url, method, body, query, params };
  }

  getFormatMessage(message, context = 'LemonTree') {
    const req_context = this.getContext();
    return { context, ...req_context, message };
  }
  log(message, context?: string) {
    this.logger.log(this.getFormatMessage(message, context));
  }
  error(message, context?: string) {
    this.logger.error(this.getFormatMessage(message, context));
  }
  warn(message, context?: string) {
    this.logger.warn(this.getFormatMessage(message, context));
  }
}

// export const MyLogger1 = (context) => {
//   return new MyLogger(context);
// };
// 怎么设置统一context？（一个文件同一个）
// @Inject？
