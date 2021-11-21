/**
 * 拦截器内追加日志, 在响应拦截器之后
 * ps：已移动到响应拦截器
 */

import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response, Request } from 'express';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly logger: Logger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req: Request = context.switchToHttp().getRequest();
    const { url, method, query, body } = req;
    return next.handle().pipe(
      tap((data) => {
        const msg = { url, method, query, body, data };
        this.logger.log(`response data: ${msg}`);
      }),
    );
  }
}
