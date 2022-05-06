import { ApiException } from 'src/common/exceptions/api.exception';
import { LoggerService } from '@nestjs/common';
import {
  HttpException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import * as cls from 'cls-hooked';
import { Request, Response } from 'express';

/**
 * 全局异常捕获
 * 追加错误日志
 */
@Catch(HttpException, ApiException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const { url, method, query, params, body, user } = req;
    let responseData = {};

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errNo = (exception as any)?.getErrorCode?.() || status;
      const errStr =
        (exception as any)?.getErrorMessage?.() || exception.getResponse();

      responseData = {
        errNo,
        errStr: errStr.message || errStr,
        data: null,
        date: new Date().toISOString(),
        path: req.url,
      };

      res.status(status).json(responseData);
    } else {
      const status = 500;
      responseData = {
        errNo: status,
        errStr: exception.message || '服务器内部异常',
        date: new Date().toISOString(),
        path: req.url,
      };
      res.status(status).json(responseData);
    }

    const logId = this.getLogid();
    const msg = {
      logId,
      url,
      method,
      query,
      params,
      body,
      user,
      data: responseData,
    };
    this.logger.error(msg, 'HttpExceptionFilter');
  }

  getLogid() {
    const namespace = cls.getNamespace('lemon');
    return namespace.get('logid');
  }
}
