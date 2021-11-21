import { LoggerService } from '@nestjs/common';
/**
 * 全局异常捕获
 * 追加错误日志
 */

import {
  HttpException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const { url, method, query, body } = req;
    let responseData = {};

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      // 自定义业务状态码
      const errNo = (exception as any).getErrorCode
        ? (exception as any).getErrorCode()
        : status;
      // 自定义业务错误信息
      const errStr = (exception as any).getErrorMessage
        ? (exception as any).getErrorMessage()
        : exception.getResponse();

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

    const msg = {
      url,
      method,
      params: query,
      body,
      data: responseData,
    };
    this.logger.error(msg, 'HttpExceptionFilter');
  }
}
