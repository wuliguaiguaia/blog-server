/**
 * 响应拦截器
 * 注：为所有http请求增加日志
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiErrorCode, ApiErrorMap } from './../exceptions/api.code.enum';
import * as cls from 'cls-hooked';
export interface Response<T> {
  start: number;
  end: number;
  spend: number;
  data: T;
  errNo: number;
  errStr: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const start = Date.now();
    const errNo = ApiErrorCode.SUCCESS;

    const req: Request = context.switchToHttp().getRequest();
    const { url, method, query, body, params, user } = req;
    const logId = this.getLogid();

    return next.handle().pipe(
      map((data) => ({
        start,
        end: Date.now(),
        spend: Date.now() - start,
        errNo,
        data,
        errStr: ApiErrorMap[errNo],
      })),
      tap((data) => {
        const msg = { logId, url, method, query, params, body, data, user };
        this.logger.log(msg, 'ResponseInterceptor');
      }),
    );
  }

  getLogid() {
    const namespace = cls.getNamespace('lemon');
    return namespace.get('logid');
  }
}
